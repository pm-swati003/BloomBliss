import { account, databases, Query, ID } from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "6a157a50000f36ef5ec6";

let subscriberBenefits = [
  { title: "10% off your first order", description: "Get a discount on your first flower purchase" },
  { title: "Free shipping over ₹500", description: "Standard delivery is completely free for orders above ₹500" }
];

class MockError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.response = {
      status,
      data: {
        error: message,
        message: message,
      },
    };
  }
}

const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (err) {
    return null;
  }
};

// Route matching engine
async function routeRequest(method, url, data, params, clientType = "standard") {
  // Normalize path
  let path = url.replace(/^(https?:\/\/[^\/]+)?\/api/, "");
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  // Strip trailing slashes
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  // Split query parameters if url has ?
  if (path.includes("?")) {
    path = path.split("?")[0];
  }

  try {
    // ==========================================
    // AUTHENTICATION & PROFILE
    // ==========================================
    if (method === "POST" && path === "/auth/login") {
      // Clear any existing session to prevent 409 conflict
      try {
        await account.deleteSession("current");
      } catch (e) {}

      const session = await account.createEmailPasswordSession(data.email, data.password);
      const authUser = await account.get();
      
      let profile;
      try {
        profile = await databases.getDocument(DATABASE_ID, "users", authUser.$id);
      } catch (e) {
        // Fallback or create default profile if not exist
        const isUserAdmin = authUser.labels?.includes("admin") || data.email.toLowerCase().includes("admin");
        profile = await databases.createDocument(DATABASE_ID, "users", authUser.$id, {
          name: authUser.name || data.email.split("@")[0],
          email: authUser.email,
          role: isUserAdmin ? "admin" : "customer",
          is_admin: isUserAdmin,
          profile_completed: false,
          reward_points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      const isAdmin = profile.role === "admin" || profile.role === "super_admin" || profile.is_admin === true || authUser.labels?.includes("admin");

      localStorage.setItem("token", session.$id);
      localStorage.setItem("refresh_token", "dummy-refresh-token");

      return { data: { user: { ...authUser, ...profile, id: profile.$id, is_admin: isAdmin }, token: session.$id } };
    }

    if (method === "POST" && path === "/auth/register") {
      const userId = ID.unique();
      await account.create(userId, data.email, data.password, data.name);
      
      const profile = await databases.createDocument(DATABASE_ID, "users", userId, {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        birthday: data.birthday || null,
        role: "customer",
        is_admin: false,
        profile_completed: false,
        reward_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Auto-trigger OTP sending for email verification
      try {
        await sendOtp(data.email, "email_verification");
      } catch (otpErr) {
        console.warn("Auto send-otp notice:", otpErr);
      }

      return { data: { message: "User registered successfully.", user: { ...profile, id: profile.$id } } };
    }

    if (method === "POST" && path === "/auth/logout") {
      try {
        await account.deleteSession("current");
      } catch (e) {}
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("delivery_token");
      localStorage.removeItem("delivery_user");
      return { data: { message: "Logged out." } };
    }

    if (method === "GET" && path === "/auth/me") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      try {
        const profile = await databases.getDocument(DATABASE_ID, "users", authUser.$id);
        const isAdmin = profile.role === "admin" || profile.role === "super_admin" || profile.is_admin === true || authUser.labels?.includes("admin");
        
        let deliveryProfile = null;
        try {
          const stored = localStorage.getItem(`delivery_profile_${authUser.$id}`);
          if (stored) {
            deliveryProfile = JSON.parse(stored);
          }
        } catch (e) {}

        if (!deliveryProfile && (profile.role === "delivery" || authUser.email?.toLowerCase().includes("delivery"))) {
          deliveryProfile = {
            vehicle_type: profile.vehicle_type || "Motorcycle / Scooter",
            vehicle_model: profile.vehicle_model || "Honda Activa 6G",
            license_plate: profile.license_plate || "MH-12-AB-1234",
            license_number: profile.license_number || "DL-1420110012345",
            document_path: profile.document_path || null,
          };
        }

        return { 
          data: { 
            ...authUser, 
            ...profile, 
            id: profile.$id, 
            is_admin: isAdmin,
            profile: deliveryProfile || profile.profile || null,
            vehicle_type: deliveryProfile?.vehicle_type || profile.vehicle_type,
            vehicle_model: deliveryProfile?.vehicle_model || profile.vehicle_model,
            license_plate: deliveryProfile?.license_plate || profile.license_plate,
            license_number: deliveryProfile?.license_number || profile.license_number,
          } 
        };
      } catch (e) {
        const isAdmin = authUser.labels?.includes("admin") || authUser.email.toLowerCase().includes("admin");
        return { 
          data: { 
            ...authUser, 
            id: authUser.$id,
            role: isAdmin ? "admin" : "customer", 
            is_admin: isAdmin, 
            profile_completed: false 
          } 
        };
      }
    }

    if (method === "POST" && path === "/auth/refresh") {
      return { data: { token: localStorage.getItem("token") || "dummy", refresh_token: "dummy" } };
    }

    // ==========================================
    // PROFILE MANAGEMENT
    // ==========================================
    if (method === "GET" && path === "/profile") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);

      let profile = {};
      try {
        profile = await databases.getDocument(DATABASE_ID, "users", authUser.$id);
      } catch (e) {}

      let orders = [];
      try {
        const orderList = await databases.listDocuments(DATABASE_ID, "orders", [
          Query.equal("user", authUser.$id),
          Query.limit(100)
        ]);
        orders = orderList.documents;
      } catch (e) {}

      let totalSpent = 0;
      orders.forEach(o => {
        if (o.status !== "cancelled") totalSpent += (parseFloat(o.total) || 0);
      });

      const isAdmin = profile.role === "admin" || profile.role === "super_admin" || profile.is_admin === true || authUser.labels?.includes("admin");

      const userObj = {
        ...authUser,
        ...profile,
        id: profile.$id || authUser.$id,
        is_admin: isAdmin,
        profile_completed: profile.profile_completed ?? false
      };

      const stats = {
        total_orders: orders.length,
        total_spent: totalSpent,
        reward_points: profile.reward_points || 0
      };

      return {
        data: {
          user: userObj,
          stats,
          profile_completed: profile.profile_completed ?? false
        }
      };
    }

    if (method === "PUT" && path === "/profile") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);

      const payload = {
        updated_at: new Date().toISOString()
      };
      if (data.name !== undefined) payload.name = data.name;
      if (data.phone !== undefined) payload.phone = data.phone;
      if (data.birthday !== undefined) payload.birthday = data.birthday;
      if (data.profile_completed !== undefined) payload.profile_completed = !!data.profile_completed;

      if (data.name && data.name !== authUser.name) {
        try {
          await account.updateName(data.name);
        } catch (e) {}
      }

      let profileDoc;
      try {
        profileDoc = await databases.updateDocument(DATABASE_ID, "users", authUser.$id, payload);
      } catch (e) {
        profileDoc = await databases.createDocument(DATABASE_ID, "users", authUser.$id, {
          email: authUser.email,
          name: authUser.name || "",
          role: "customer",
          is_admin: false,
          reward_points: 0,
          ...payload,
          created_at: new Date().toISOString()
        });
      }

      return {
        data: {
          user: { ...authUser, ...profileDoc, id: profileDoc.$id },
          profile_completed: profileDoc.profile_completed
        }
      };
    }

    if (method === "POST" && path === "/profile/complete") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);

      const payload = {
        profile_completed: true,
        updated_at: new Date().toISOString()
      };
      if (data.phone) payload.phone = data.phone;
      if (data.birthday) payload.birthday = data.birthday;

      let profileDoc;
      try {
        profileDoc = await databases.updateDocument(DATABASE_ID, "users", authUser.$id, payload);
      } catch (e) {
        profileDoc = await databases.createDocument(DATABASE_ID, "users", authUser.$id, {
          email: authUser.email,
          name: authUser.name || "",
          role: "customer",
          is_admin: false,
          reward_points: 0,
          ...payload,
          created_at: new Date().toISOString()
        });
      }

      return {
        data: {
          user: { ...authUser, ...profileDoc, id: profileDoc.$id },
          profile_completed: true
        }
      };
    }

    if (method === "PUT" && path === "/profile/password") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      if (!data.password || !data.current_password) {
        throw new MockError("Current password and new password are required", 422);
      }
      await account.updatePassword(data.password, data.current_password);
      return { data: { message: "Password updated successfully." } };
    }

    // ==========================================
    // CATEGORIES & OCCASIONS
    // ==========================================
    if (method === "GET" && path === "/categories") {
      const list = await databases.listDocuments(DATABASE_ID, "categories", [Query.limit(100)]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "GET" && path.match(/^\/categories\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/categories\/([a-zA-Z0-9_-]+)$/)[1];
      const doc = await databases.getDocument(DATABASE_ID, "categories", id);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "GET" && path === "/occasions") {
      const list = await databases.listDocuments(DATABASE_ID, "occasions", [Query.limit(100)]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "GET" && path.match(/^\/occasions\/([a-zA-Z0-9_-]+)$/)) {
      const slug = path.match(/^\/occasions\/([a-zA-Z0-9_-]+)$/)[1];
      const list = await databases.listDocuments(DATABASE_ID, "occasions", [
        Query.equal("slug", slug),
        Query.limit(1),
      ]);
      if (list.total === 0) throw new MockError("Occasion not found", 404);
      return { data: { ...list.documents[0], id: list.documents[0].$id } };
    }

    if (method === "GET" && path.match(/^\/occasions\/([a-zA-Z0-9_-]+)\/products$/)) {
      const slug = path.match(/^\/occasions\/([a-zA-Z0-9_-]+)\/products$/)[1];
      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 12);
      
      const mapping = {
        wedding: ["wedding", "roses"],
        anniversary: ["roses"],
        housewarming: ["orchids", "peonies", "lilies"],
        sympathy: ["sympathy", "lilies"],
        birthday: ["birthday", "roses"],
        "new-baby": ["lilies", "orchids"],
      };
      
      const categorySlugs = mapping[slug] || [slug];
      const catList = await databases.listDocuments(DATABASE_ID, "categories", [
        Query.equal("slug", categorySlugs),
        Query.limit(100),
      ]);
      
      const catIds = catList.documents.map(c => c.$id);
      if (catIds.length === 0) {
        return { data: { data: [], current_page: page, last_page: 1, total: 0 } };
      }
      
      const queries = [
        Query.equal("category", catIds),
        Query.limit(perPage),
        Query.offset((page - 1) * perPage),
      ];
      
      const prodList = await databases.listDocuments(DATABASE_ID, "products", queries);
      return {
        data: {
          data: prodList.documents.map(d => ({ ...d, id: d.$id })),
          current_page: page,
          last_page: Math.ceil(prodList.total / perPage),
          total: prodList.total,
        },
      };
    }

    // ==========================================
    // PRODUCTS
    // ==========================================
    if (method === "GET" && path === "/products") {
      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 12);
      const sortBy = params?.sort_by || "created_at";
      const sortOrder = params?.sort_order || "desc";
      const priceMin = params?.price_min;
      const priceMax = params?.price_max;
      const categoryParam = params?.category;
      const search = params?.search;

      const queries = [];
      
      if (categoryParam) {
        let categoryId = categoryParam;
        if (isNaN(categoryParam)) {
          const catList = await databases.listDocuments(DATABASE_ID, "categories", [
            Query.equal("slug", categoryParam),
            Query.limit(1),
          ]);
          if (catList.total > 0) {
            categoryId = catList.documents[0].$id;
          }
        }
        queries.push(Query.equal("category", categoryId));
      }

      if (priceMin !== undefined) {
        queries.push(Query.greaterThanEqual("price", parseFloat(priceMin)));
      }
      if (priceMax !== undefined) {
        queries.push(Query.lessThanEqual("price", parseFloat(priceMax)));
      }
      if (search) {
        queries.push(Query.search("name", search));
      }

      if (sortBy) {
        if (sortOrder === "desc") {
          queries.push(Query.orderDesc(sortBy));
        } else {
          queries.push(Query.orderAsc(sortBy));
        }
      }

      queries.push(Query.limit(perPage));
      queries.push(Query.offset((page - 1) * perPage));

      const prodList = await databases.listDocuments(DATABASE_ID, "products", queries);
      
      return {
        data: {
          data: prodList.documents.map(d => ({ ...d, id: d.$id })),
          current_page: page,
          last_page: Math.ceil(prodList.total / perPage),
          total: prodList.total,
        },
      };
    }

    if (method === "GET" && path === "/products/best-selling") {
      const list = await databases.listDocuments(DATABASE_ID, "products", [
        Query.equal("is_best_selling", true),
        Query.limit(10),
      ]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "GET" && path.match(/^\/products\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/products\/([a-zA-Z0-9_-]+)$/)[1];
      const doc = await databases.getDocument(DATABASE_ID, "products", id);
      return { data: { ...doc, id: doc.$id } };
    }

    // ==========================================
    // REVIEWS
    // ==========================================
    if (method === "GET" && path === "/reviews") {
      const queries = [Query.limit(100)];
      if (params?.product_id) {
        queries.push(Query.equal("product", params.product_id.toString()));
      }
      const list = await databases.listDocuments(DATABASE_ID, "reviews", queries);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/reviews") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      const doc = await databases.createDocument(DATABASE_ID, "reviews", ID.unique(), {
        user: authUser.$id,
        product: data.product_id.toString(),
        rating: parseInt(data.rating),
        comment: data.comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    // ==========================================
    // NEWSLETTER
    // ==========================================
    if (method === "GET" && path === "/newsletter/benefits") {
      return { data: ["10% off your first order", "Free birthday blooms", "Early access to new collections"] };
    }

    if (method === "POST" && path === "/newsletter/subscribe") {
      const doc = await databases.createDocument(DATABASE_ID, "subscribers", ID.unique(), {
        email: data.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { message: "Subscribed successfully", doc } };
    }

    if (method === "GET" && path === "/newsletter/my-perks") {
      return { data: { perks: ["Subscribed to newsletter", "Exclusive discount code: HELLO10"] } };
    }

    // ==========================================
    // COUPONS
    // ==========================================
    if (method === "POST" && path === "/coupons/validate") {
      const list = await databases.listDocuments(DATABASE_ID, "coupons", [
        Query.equal("code", data.code),
        Query.equal("is_active", true),
        Query.limit(1),
      ]);
      
      if (list.total === 0) throw new MockError("Invalid coupon code", 422);
      const coupon = list.documents[0];
      
      if (data.order_subtotal < coupon.min_order) {
        throw new MockError(`Minimum order amount of ₹${coupon.min_order} required`, 422);
      }
      
      return { data: { ...coupon, id: coupon.$id } };
    }

    // ==========================================
    // PROFILE
    // ==========================================
    if (method === "GET" && path === "/profile") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      const profile = await databases.getDocument(DATABASE_ID, "users", authUser.$id);
      return { data: { ...profile, id: profile.$id } };
    }

    if (method === "PUT" && path === "/profile") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      const payload = { ...data, updated_at: new Date().toISOString() };
      delete payload.id;
      delete payload.email;
      
      const doc = await databases.updateDocument(DATABASE_ID, "users", authUser.$id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "POST" && path === "/profile/complete") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      const doc = await databases.updateDocument(DATABASE_ID, "users", authUser.$id, {
        phone: data.phone,
        birthday: data.birthday,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      });
      
      if (data.street) {
        await databases.createDocument(DATABASE_ID, "addresses", ID.unique(), {
          user: authUser.$id,
          name: data.name || authUser.name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip,
          type: "Home",
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path === "/profile/password") {
      await account.updatePassword(data.password, data.current_password);
      return { data: { message: "Password updated successfully" } };
    }

    // ==========================================
    // CART
    // ==========================================
    if (method === "GET" && path === "/cart") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: [] };
      const list = await databases.listDocuments(DATABASE_ID, "cart_items", [
        Query.equal("user", authUser.$id),
        Query.limit(100),
      ]);
      
      // Resolve product information for each cart item
      const items = [];
      for (const item of list.documents) {
        let prod = null;
        try {
          prod = typeof item.product === "object" ? item.product : await databases.getDocument(DATABASE_ID, "products", item.product);
        } catch (e) {}
        items.push({
          ...item,
          id: item.$id,
          product: prod ? { ...prod, id: prod.$id } : null,
        });
      }
      return { data: items };
    }

    if (method === "GET" && path === "/cart/count") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: { count: 0 } };
      const list = await databases.listDocuments(DATABASE_ID, "cart_items", [
        Query.equal("user", authUser.$id),
        Query.limit(100),
      ]);
      return { data: { count: list.total } };
    }

    if (method === "POST" && path === "/cart") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      const existingList = await databases.listDocuments(DATABASE_ID, "cart_items", [
        Query.equal("user", authUser.$id),
        Query.equal("product", data.product_id.toString()),
        Query.limit(1),
      ]);
      
      if (existingList.total > 0) {
        const item = existingList.documents[0];
        const newQty = item.quantity + (data.quantity || 1);
        const updated = await databases.updateDocument(DATABASE_ID, "cart_items", item.$id, {
          quantity: newQty,
          updated_at: new Date().toISOString(),
        });
        return { data: { ...updated, id: updated.$id } };
      } else {
        const doc = await databases.createDocument(DATABASE_ID, "cart_items", ID.unique(), {
          user: authUser.$id,
          product: data.product_id.toString(),
          quantity: data.quantity || 1,
          size: data.size || null,
          occasion: data.occasion || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return { data: { ...doc, id: doc.$id } };
      }
    }

    if (method === "PUT" && path.match(/^\/cart\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/cart\/([a-zA-Z0-9_-]+)$/)[1];
      const doc = await databases.updateDocument(DATABASE_ID, "cart_items", id, {
        quantity: data.quantity,
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "DELETE" && path.match(/^\/cart\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/cart\/([a-zA-Z0-9_-]+)$/)[1];
      await databases.deleteDocument(DATABASE_ID, "cart_items", id);
      return { data: { message: "Deleted" } };
    }

    // ==========================================
    // ADDRESSES
    // ==========================================
    if (method === "GET" && path === "/addresses") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: [] };
      const list = await databases.listDocuments(DATABASE_ID, "addresses", [
        Query.equal("user", authUser.$id),
        Query.limit(100),
      ]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/addresses") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      if (data.is_default) {
        const list = await databases.listDocuments(DATABASE_ID, "addresses", [
          Query.equal("user", authUser.$id),
          Query.equal("is_default", true),
        ]);
        for (const d of list.documents) {
          await databases.updateDocument(DATABASE_ID, "addresses", d.$id, { is_default: false });
        }
      }
      
      const doc = await databases.createDocument(DATABASE_ID, "addresses", ID.unique(), {
        user: authUser.$id,
        name: data.name,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        type: data.type || "Home",
        is_default: !!data.is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/addresses\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/addresses\/([a-zA-Z0-9_-]+)$/)[1];
      const authUser = await getCurrentUser();
      
      if (data.is_default && authUser) {
        const list = await databases.listDocuments(DATABASE_ID, "addresses", [
          Query.equal("user", authUser.$id),
          Query.equal("is_default", true),
        ]);
        for (const d of list.documents) {
          if (d.$id !== id) {
            await databases.updateDocument(DATABASE_ID, "addresses", d.$id, { is_default: false });
          }
        }
      }
      
      const payload = { ...data, updated_at: new Date().toISOString() };
      delete payload.id;
      
      const doc = await databases.updateDocument(DATABASE_ID, "addresses", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "DELETE" && path.match(/^\/addresses\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/addresses\/([a-zA-Z0-9_-]+)$/)[1];
      await databases.deleteDocument(DATABASE_ID, "addresses", id);
      return { data: { message: "Deleted" } };
    }

    // ==========================================
    // PAYMENT METHODS
    // ==========================================
    if (method === "GET" && path === "/payment-methods") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: [] };
      const list = await databases.listDocuments(DATABASE_ID, "payment_methods", [
        Query.equal("user", authUser.$id),
        Query.limit(100),
      ]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/payment-methods") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      if (data.is_default) {
        const list = await databases.listDocuments(DATABASE_ID, "payment_methods", [
          Query.equal("user", authUser.$id),
          Query.equal("is_default", true),
        ]);
        for (const d of list.documents) {
          await databases.updateDocument(DATABASE_ID, "payment_methods", d.$id, { is_default: false });
        }
      }
      
      const doc = await databases.createDocument(DATABASE_ID, "payment_methods", ID.unique(), {
        user: authUser.$id,
        type: data.type,
        last4: data.last4,
        expiry: data.expiry,
        name: data.name,
        is_default: !!data.is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/payment-methods\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/payment-methods\/([a-zA-Z0-9_-]+)$/)[1];
      const authUser = await getCurrentUser();
      
      if (data.is_default && authUser) {
        const list = await databases.listDocuments(DATABASE_ID, "payment_methods", [
          Query.equal("user", authUser.$id),
          Query.equal("is_default", true),
        ]);
        for (const d of list.documents) {
          if (d.$id !== id) {
            await databases.updateDocument(DATABASE_ID, "payment_methods", d.$id, { is_default: false });
          }
        }
      }
      
      const payload = { ...data, updated_at: new Date().toISOString() };
      delete payload.id;
      
      const doc = await databases.updateDocument(DATABASE_ID, "payment_methods", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "DELETE" && path.match(/^\/payment-methods\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/payment-methods\/([a-zA-Z0-9_-]+)$/)[1];
      await databases.deleteDocument(DATABASE_ID, "payment_methods", id);
      return { data: { message: "Deleted" } };
    }

    // ==========================================
    // ORDERS
    // ==========================================
    if (method === "GET" && path === "/orders") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: [] };
      const list = await databases.listDocuments(DATABASE_ID, "orders", [
        Query.equal("user", authUser.$id),
        Query.orderDesc("created_at"),
        Query.limit(100),
      ]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/orders") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      
      const orderNumber = "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const trackingNumber = "TRK" + Math.random().toString(36).substring(2, 12).toUpperCase();
      
      const orderDoc = await databases.createDocument(DATABASE_ID, "orders", ID.unique(), {
        order_number: orderNumber,
        subtotal: parseFloat(data.subtotal),
        shipping: parseFloat(data.shipping),
        discount: parseFloat(data.discount),
        total: parseFloat(data.total),
        status: "pending",
        tracking_number: trackingNumber,
        delivery_date: data.delivery_date || new Date(Date.now() + 3*24*60*60*1000).toISOString(),
        delivery_time: data.delivery_time || "afternoon",
        rider_lat: null,
        rider_lng: null,
        estimated_delivery_at: null,
        delivery_lat: null,
        delivery_lng: null,
        distance_km: null,
        delivery_earnings: null,
        rider: null,
        user: authUser.$id,
        shipping_address: data.shipping_address_id.toString(),
        payment_method: data.payment_method_id.toString(),
        coupon: data.coupon_id ? data.coupon_id.toString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      const cartItems = await databases.listDocuments(DATABASE_ID, "cart_items", [
        Query.equal("user", authUser.$id),
        Query.limit(100),
      ]);
      
      for (const c of cartItems.documents) {
        let prod = null;
        try {
          prod = typeof c.product === "object" ? c.product : await databases.getDocument(DATABASE_ID, "products", c.product);
        } catch (e) {}
        
        await databases.createDocument(DATABASE_ID, "order_items", ID.unique(), {
          order: orderDoc.$id,
          product: prod ? prod.$id : c.product,
          product_name: prod ? prod.name : "Flower Item",
          price: prod ? prod.price : 0,
          quantity: c.quantity,
          size: c.size || null,
          occasion: c.occasion || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        await databases.deleteDocument(DATABASE_ID, "cart_items", c.$id);
      }
      
      await databases.createDocument(DATABASE_ID, "notifications", ID.unique(), {
        user: authUser.$id,
        type: "order_status",
        title: `Order ${orderNumber}`,
        body: "Your order has been confirmed and is being processed.",
        data: JSON.stringify({ order_id: orderDoc.$id, order_number: orderNumber, status: "pending" }),
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      return { data: { ...orderDoc, id: orderDoc.$id } };
    }

    if (method === "GET" && path.match(/^\/orders\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/orders\/([a-zA-Z0-9_-]+)$/)[1];
      const orderDoc = await databases.getDocument(DATABASE_ID, "orders", id);
      const itemsList = await databases.listDocuments(DATABASE_ID, "order_items", [
        Query.equal("order", id),
        Query.limit(100),
      ]);
      
      const items = [];
      for (const item of itemsList.documents) {
        let prod = null;
        try {
          prod = typeof item.product === "object" ? item.product : await databases.getDocument(DATABASE_ID, "products", item.product);
        } catch (e) {}
        items.push({
          ...item,
          id: item.$id,
          product: prod ? { ...prod, id: prod.$id } : null,
        });
      }
      
      let shippingAddressDoc = null;
      try {
        shippingAddressDoc = typeof orderDoc.shipping_address === "object" ? orderDoc.shipping_address : await databases.getDocument(DATABASE_ID, "addresses", orderDoc.shipping_address);
      } catch (e) {}
      
      let paymentMethodDoc = null;
      try {
        paymentMethodDoc = typeof orderDoc.payment_method === "object" ? orderDoc.payment_method : await databases.getDocument(DATABASE_ID, "payment_methods", orderDoc.payment_method);
      } catch (e) {}
      
      return {
        data: {
          ...orderDoc,
          id: orderDoc.$id,
          items,
          shipping_address: shippingAddressDoc ? { ...shippingAddressDoc, id: shippingAddressDoc.$id } : null,
          payment_method: paymentMethodDoc ? { ...paymentMethodDoc, id: paymentMethodDoc.$id } : null,
        },
      };
    }

    if (method === "GET" && path.match(/^\/orders\/([a-zA-Z0-9_-]+)\/tracking$/)) {
      const id = path.match(/^\/orders\/([a-zA-Z0-9_-]+)\/tracking$/)[1];
      const orderDoc = await databases.getDocument(DATABASE_ID, "orders", id);
      return { data: { ...orderDoc, id: orderDoc.$id } };
    }

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    if (method === "GET" && path === "/notifications") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: { data: [] } };
      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 10);
      
      const list = await databases.listDocuments(DATABASE_ID, "notifications", [
        Query.equal("user", authUser.$id),
        Query.orderDesc("created_at"),
        Query.limit(perPage),
        Query.offset((page - 1) * perPage),
      ]);
      
      return {
        data: {
          data: list.documents.map(d => ({ ...d, id: d.$id, data: d.data ? JSON.parse(d.data) : null })),
          current_page: page,
          last_page: Math.ceil(list.total / perPage),
          total: list.total,
        },
      };
    }

    if (method === "GET" && path === "/notifications/unread-count") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: { count: 0 } };
      const list = await databases.listDocuments(DATABASE_ID, "notifications", [
        Query.equal("user", authUser.$id),
        Query.isNull("read_at"),
        Query.limit(1),
      ]);
      return { data: { count: list.total } };
    }

    if (method === "PUT" && path.match(/^\/notifications\/([a-zA-Z0-9_-]+)\/read$/)) {
      const id = path.match(/^\/notifications\/([a-zA-Z0-9_-]+)\/read$/)[1];
      const doc = await databases.updateDocument(DATABASE_ID, "notifications", id, {
        read_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "POST" && path === "/notifications/mark-all-read") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);
      const list = await databases.listDocuments(DATABASE_ID, "notifications", [
        Query.equal("user", authUser.$id),
        Query.isNull("read_at"),
        Query.limit(100),
      ]);
      for (const doc of list.documents) {
        await databases.updateDocument(DATABASE_ID, "notifications", doc.$id, {
          read_at: new Date().toISOString(),
        });
      }
      return { data: { success: true } };
    }

    // ==========================================
    // ADMIN FLOWS
    // ==========================================
    if (method === "GET" && path === "/admin/stats") {
      const orders = await databases.listDocuments(DATABASE_ID, "orders", [Query.limit(1000)]);
      const customers = await databases.listDocuments(DATABASE_ID, "users", [Query.equal("role", "customer"), Query.limit(1000)]);
      const products = await databases.listDocuments(DATABASE_ID, "products", [Query.limit(1000)]);
      
      let sales = 0;
      for (const o of orders.documents) {
        if (o.status !== "cancelled") {
          const val = parseFloat(o.total || 0);
          if (!isNaN(val)) {
            sales += val;
          }
        }
      }
      
      return {
        data: {
          total_revenue: isNaN(sales) ? 0 : sales,
          orders_count: orders.total ?? orders.documents.length,
          customers_count: customers.total ?? customers.documents.length,
          products_count: products.total ?? products.documents.length,
          revenue_change: 12.5,
          orders_change: 8.2,
        },
      };
    }

    if (method === "GET" && path === "/admin/recent-orders") {
      const list = await databases.listDocuments(DATABASE_ID, "orders", [
        Query.orderDesc("created_at"),
        Query.limit(5),
      ]);
      
      const orders = [];
      for (const o of list.documents) {
        let customerDoc = null;
        try {
          customerDoc = typeof o.user === "object" ? o.user : await databases.getDocument(DATABASE_ID, "users", o.user);
        } catch (e) {}

        let items = [];
        try {
          const itemsList = await databases.listDocuments(DATABASE_ID, "order_items", [
            Query.equal("order", o.$id),
            Query.limit(5),
          ]);
          items = itemsList.documents.map(it => ({ ...it, id: it.$id }));
        } catch (e) {}

        const productName = items.length > 0 ? items[0].product_name : "Flower Bouquet";
        const customerName = customerDoc?.name || (customerDoc?.email ? customerDoc.email.split("@")[0] : "Customer");
        const amount = parseFloat(o.total || 0) || 0;

        orders.push({
          ...o,
          id: o.$id,
          user: customerDoc,
          customer: customerName,
          product: productName,
          amount: amount,
          total: amount,
          items: items,
        });
      }
      return { data: orders };
    }

    if (method === "GET" && path === "/admin/deliveries-due-today") {
      const list = await databases.listDocuments(DATABASE_ID, "orders", [
        Query.equal("status", "processing"),
        Query.limit(10),
      ]);
      const orders = [];
      for (const o of list.documents) {
        let customerDoc = null;
        try {
          customerDoc = typeof o.user === "object" ? o.user : await databases.getDocument(DATABASE_ID, "users", o.user);
        } catch (e) {}
        orders.push({
          ...o,
          id: o.$id,
          customer: customerDoc?.name || "Customer",
          user: customerDoc,
        });
      }
      return { data: orders };
    }

    if (method === "GET" && path === "/admin/low-stock") {
      const threshold = parseInt(params?.threshold || 20);
      const list = await databases.listDocuments(DATABASE_ID, "products", [
        Query.lessThanEqual("stock", threshold),
        Query.limit(50),
      ]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id, threshold: d.threshold || threshold })) };
    }

    if (method === "GET" && path === "/admin/config") {
      return {
        data: {
          threshold: 20,
          roles: {
            super_admin: "Super Admin",
            admin: "Admin",
            shop_keeper: "Shop Keeper",
            delivery: "Delivery Partner",
            customer: "Customer",
          },
          assignable_roles: {
            admin: "Admin",
            shop_keeper: "Shop Keeper",
            delivery: "Delivery Partner",
          },
          permissions: {
            manage_staff: "Add/remove staff and change their role",
            manage_products: "Create, edit, delete products",
            manage_orders: "View and update orders",
            view_customers: "View customer list",
            manage_settings: "Change store settings",
            manage_subscribers: "Manage newsletter subscribers, coupons and subscriber benefits",
          },
          role_permissions: {
            super_admin: [
              "manage_staff",
              "manage_products",
              "manage_orders",
              "view_customers",
              "manage_settings",
              "manage_subscribers",
            ],
            admin: [
              "manage_products",
              "manage_orders",
              "view_customers",
              "manage_settings",
            ],
            shop_keeper: ["manage_orders", "view_customers"],
            delivery: [],
            customer: [],
          },
        },
      };
    }

    if (method === "GET" && path === "/admin/settings") {
      return {
        data: {
          store_name: "Bloom & Bliss",
          store_email: "support@bloombliss.com",
          shipping_fee: 150,
          free_shipping_threshold: 1500,
        },
      };
    }

    if (method === "PUT" && path === "/admin/settings") {
      return { data: { success: true } };
    }

    if (method === "GET" && path === "/admin/orders") {
      const queries = [Query.orderDesc("created_at"), Query.limit(100)];
      if (params?.status && params.status !== "all") {
        queries.push(Query.equal("status", params.status));
      }

      const list = await databases.listDocuments(DATABASE_ID, "orders", queries);
      let orders = [];
      for (const o of list.documents) {
        let customerDoc = null;
        try {
          customerDoc = typeof o.user === "object" ? o.user : await databases.getDocument(DATABASE_ID, "users", o.user);
        } catch (e) {}

        let items = [];
        try {
          const itemsList = await databases.listDocuments(DATABASE_ID, "order_items", [
            Query.equal("order", o.$id),
            Query.limit(20),
          ]);
          items = itemsList.documents.map(it => ({ ...it, id: it.$id }));
        } catch (e) {}

        let pm = null;
        if (typeof o.payment_method === "object" && o.payment_method) {
          pm = o.payment_method;
        } else if (typeof o.payment_method === "string" && o.payment_method) {
          try {
            const pmDoc = await databases.getDocument(DATABASE_ID, "payment_methods", o.payment_method);
            pm = { ...pmDoc, id: pmDoc.$id };
          } catch (e) {
            pm = { type: o.payment_method.length > 15 ? "Online / Card" : o.payment_method };
          }
        }
        if (!pm) {
          pm = { type: "Online / Card" };
        }

        let riderDoc = null;
        if (o.rider) {
          try {
            riderDoc = typeof o.rider === "object" ? o.rider : await databases.getDocument(DATABASE_ID, "users", o.rider);
          } catch (e) {}
        }

        const customerName = customerDoc?.name || (customerDoc?.email ? customerDoc.email.split("@")[0] : "Customer");
        const productName = items.length > 0 ? items[0].product_name : "Flower Bouquet";
        const totalAmount = parseFloat(o.total || 0) || 0;

        orders.push({
          ...o,
          id: o.$id,
          user: customerDoc,
          customer: customerName,
          product: productName,
          items: items,
          payment_method: pm,
          rider: riderDoc ? { ...riderDoc, id: riderDoc.$id } : null,
          total: totalAmount,
          amount: totalAmount,
        });
      }

      if (params?.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.order_number?.toLowerCase().includes(q) ||
            o.customer?.toLowerCase().includes(q) ||
            o.product?.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q)
        );
      }

      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 15);
      const totalCount = orders.length;
      const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage);

      return {
        data: {
          data: paginatedOrders,
          current_page: page,
          last_page: Math.max(1, Math.ceil(totalCount / perPage)),
          total: totalCount,
        },
      };
    }

    if (method === "GET" && path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)$/)[1];
      const orderDoc = await databases.getDocument(DATABASE_ID, "orders", id);
      const itemsList = await databases.listDocuments(DATABASE_ID, "order_items", [
        Query.equal("order", id),
        Query.limit(100),
      ]);
      const items = [];
      for (const item of itemsList.documents) {
        let prod = null;
        try {
          prod = typeof item.product === "object" ? item.product : await databases.getDocument(DATABASE_ID, "products", item.product);
        } catch (e) {}
        items.push({
          ...item,
          id: item.$id,
          product: prod ? { ...prod, id: prod.$id } : null,
        });
      }
      
      let customerDoc = null;
      try {
        customerDoc = typeof orderDoc.user === "object" ? orderDoc.user : await databases.getDocument(DATABASE_ID, "users", orderDoc.user);
      } catch (e) {}
      
      let shippingAddressDoc = null;
      try {
        shippingAddressDoc = typeof orderDoc.shipping_address === "object" ? orderDoc.shipping_address : await databases.getDocument(DATABASE_ID, "addresses", orderDoc.shipping_address);
      } catch (e) {}

      return {
        data: {
          ...orderDoc,
          id: orderDoc.$id,
          items,
          user: customerDoc,
          shipping_address: shippingAddressDoc ? { ...shippingAddressDoc, id: shippingAddressDoc.$id } : null,
        },
      };
    }

    if (method === "PUT" && path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)\/status$/)) {
      const id = path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)\/status$/)[1];
      const doc = await databases.updateDocument(DATABASE_ID, "orders", id, {
        status: data.status,
        updated_at: new Date().toISOString(),
      });
      
      try {
        await databases.createDocument(DATABASE_ID, "notifications", ID.unique(), {
          user: doc.user,
          type: "order_status",
          title: `Order ${doc.order_number} Status`,
          body: `Your order is now ${data.status}.`,
          data: JSON.stringify({ order_id: doc.$id, order_number: doc.order_number, status: data.status }),
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (e) {}
      
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)\/tracking$/)) {
      const id = path.match(/^\/admin\/orders\/([a-zA-Z0-9_-]+)\/tracking$/)[1];
      const payload = {
        updated_at: new Date().toISOString(),
      };
      if (data.rider_lat !== undefined) payload.rider_lat = parseFloat(data.rider_lat);
      if (data.rider_lng !== undefined) payload.rider_lng = parseFloat(data.rider_lng);
      if (data.estimated_delivery_at !== undefined) payload.estimated_delivery_at = data.estimated_delivery_at;
      
      const doc = await databases.updateDocument(DATABASE_ID, "orders", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "GET" && path === "/admin/categories") {
      const list = await databases.listDocuments(DATABASE_ID, "categories", [Query.limit(100)]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/admin/categories") {
      const doc = await databases.createDocument(DATABASE_ID, "categories", ID.unique(), {
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description || null,
        image: data.image || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "GET" && path === "/admin/products") {
      let categoriesMap = {};
      try {
        const catList = await databases.listDocuments(DATABASE_ID, "categories", [Query.limit(100)]);
        for (const cat of catList.documents) {
          categoriesMap[cat.$id] = cat;
          if (cat.slug) categoriesMap[cat.slug] = cat;
        }
      } catch (e) {}

      const queries = [Query.limit(100)];
      if (params?.category && params.category !== "all") {
        queries.push(Query.equal("category", params.category));
      }
      if (params?.search) {
        queries.push(Query.search("name", params.search));
      }

      const list = await databases.listDocuments(DATABASE_ID, "products", queries);
      const prods = list.documents.map((d) => {
        let catObj = null;
        if (typeof d.category === "object" && d.category !== null) {
          catObj = d.category;
        } else if (d.category && categoriesMap[d.category]) {
          catObj = { id: categoriesMap[d.category].$id, name: categoriesMap[d.category].name };
        } else if (typeof d.category === "string" && d.category) {
          catObj = { id: d.category, name: d.category };
        } else {
          catObj = { name: "Flowers" };
        }

        return {
          ...d,
          id: d.$id,
          category: catObj,
          sold: d.sold || 0,
          price: parseFloat(d.price || 0),
        };
      });

      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 12);
      const total = list.total || prods.length;

      return {
        data: {
          data: prods,
          current_page: page,
          last_page: Math.max(1, Math.ceil(total / perPage)),
          total: total,
        },
      };
    }

    if (method === "POST" && path === "/admin/products") {
      const doc = await databases.createDocument(DATABASE_ID, "products", ID.unique(), {
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description || "",
        price: parseFloat(data.price),
        discount_percentage: parseFloat(data.discount_percentage || 0),
        image: data.image || "",
        images: data.images || [],
        stock: parseInt(data.stock),
        is_featured: !!data.is_featured,
        is_best_selling: !!data.is_best_selling,
        is_active: true,
        category: data.category_id.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/admin\/products\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/admin\/products\/([a-zA-Z0-9_-]+)$/)[1];
      const payload = { ...data, updated_at: new Date().toISOString() };
      if (data.category_id) payload.category = data.category_id.toString();
      delete payload.id;
      delete payload.category_id;
      
      const doc = await databases.updateDocument(DATABASE_ID, "products", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "DELETE" && path.match(/^\/admin\/products\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/admin\/products\/([a-zA-Z0-9_-]+)$/)[1];
      await databases.deleteDocument(DATABASE_ID, "products", id);
      return { data: { message: "Deleted" } };
    }

    if (method === "GET" && path === "/admin/customers") {
      const usersList = await databases.listDocuments(DATABASE_ID, "users", [
        Query.equal("role", "customer"),
        Query.limit(100),
      ]);

      let ordersList = { documents: [] };
      try {
        ordersList = await databases.listDocuments(DATABASE_ID, "orders", [Query.limit(1000)]);
      } catch (e) {}

      let addressesMap = {};
      try {
        const addressList = await databases.listDocuments(DATABASE_ID, "addresses", [Query.limit(1000)]);
        for (const addr of addressList.documents) {
          const uId = typeof addr.user === "object" ? addr.user?.$id : addr.user;
          if (uId && !addressesMap[uId]) {
            const loc = [addr.city, addr.state].filter(Boolean).join(", ");
            addressesMap[uId] = loc || addr.address_line1 || "India";
          }
        }
      } catch (e) {}

      const customerOrdersCount = {};
      const customerTotalSpent = {};

      for (const order of ordersList.documents) {
        const uId = typeof order.user === "object" ? order.user?.$id : order.user;
        if (uId) {
          customerOrdersCount[uId] = (customerOrdersCount[uId] || 0) + 1;
          if (order.status !== "cancelled") {
            const amt = parseFloat(order.total || 0) || 0;
            customerTotalSpent[uId] = (customerTotalSpent[uId] || 0) + amt;
          }
        }
      }

      const customers = usersList.documents.map((d) => {
        const orderCount = customerOrdersCount[d.$id] || 0;
        const totalSpent = customerTotalSpent[d.$id] || 0;

        const dateStr = d.created_at || d.$createdAt;
        const joinDate = dateStr
          ? new Date(dateStr).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "29 Apr 2026";

        const location =
          addressesMap[d.$id] ||
          d.location ||
          d.city ||
          "India";

        return {
          ...d,
          id: d.$id,
          name: d.name || d.email?.split("@")[0] || "Customer",
          email: d.email || "",
          phone: d.phone || "—",
          status: "Active",
          orders: orderCount,
          total_spent: totalSpent,
          join_date: joinDate,
          location: location,
        };
      });

      let filtered = customers;
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q)
        );
      }

      if (params?.sort_by) {
        if (params.sort_by === "name") {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (params.sort_by === "orders") {
          filtered.sort((a, b) => b.orders - a.orders);
        } else if (params.sort_by === "spent") {
          filtered.sort((a, b) => b.total_spent - a.total_spent);
        } else if (params.sort_by === "date") {
          filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
      }

      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 15);
      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * perPage, page * perPage);

      return {
        data: {
          data: paginated,
          current_page: page,
          last_page: Math.max(1, Math.ceil(total / perPage)),
          total: total,
        },
      };
    }

    if (method === "GET" && path === "/admin/staff") {
      const list = await databases.listDocuments(DATABASE_ID, "users", [
        Query.notEqual("role", "customer"),
        Query.limit(100),
      ]);
      let staff = list.documents.map((d) => ({
        ...d,
        id: d.$id,
        name: d.name || d.email?.split("@")[0] || "Staff Member",
        email: d.email || "",
        role: d.role || "admin",
      }));

      if (params?.role && params.role !== "all") {
        staff = staff.filter((s) => s.role === params.role);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        staff = staff.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
      }

      const page = parseInt(params?.page || 1);
      const perPage = parseInt(params?.per_page || 15);
      const total = staff.length;
      const paginated = staff.slice((page - 1) * perPage, page * perPage);

      return {
        data: {
          data: paginated,
          current_page: page,
          last_page: Math.max(1, Math.ceil(total / perPage)),
          total: total,
        },
      };
    }

    if (method === "POST" && path === "/admin/staff") {
      const userId = ID.unique();
      await account.create(userId, data.email, data.password, data.name);
      
      const profile = await databases.createDocument(DATABASE_ID, "users", userId, {
        name: data.name,
        email: data.email,
        role: data.role,
        is_admin: data.role === "admin" || data.role === "super_admin",
        profile_completed: true,
        reward_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...profile, id: profile.$id } };
    }

    if (method === "PUT" && path.match(/^\/admin\/staff\/([a-zA-Z0-9_-]+)\/role$/)) {
      const id = path.match(/^\/admin\/staff\/([a-zA-Z0-9_-]+)\/role$/)[1];
      const doc = await databases.updateDocument(DATABASE_ID, "users", id, {
        role: data.role,
        is_admin: data.role === "admin" || data.role === "super_admin",
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "GET" && path === "/admin/subscribers") {
      const list = await databases.listDocuments(DATABASE_ID, "subscribers", [Query.limit(100)]);
      return { data: { data: list.documents.map(d => ({ ...d, id: d.$id })) } };
    }

    if (method === "GET" && path === "/admin/coupons") {
      const list = await databases.listDocuments(DATABASE_ID, "coupons", [Query.limit(100)]);
      return { data: list.documents.map(d => ({ ...d, id: d.$id })) };
    }

    if (method === "POST" && path === "/admin/coupons") {
      const doc = await databases.createDocument(DATABASE_ID, "coupons", ID.unique(), {
        code: data.code,
        description: data.description || "",
        discount_type: data.discount_type || "percent",
        value: parseFloat(data.value),
        min_order: parseFloat(data.min_order || 0),
        for_subscribers_only: !!data.for_subscribers_only,
        valid_from: data.valid_from || new Date().toISOString(),
        valid_until: data.valid_until || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        used_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/admin\/coupons\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/admin\/coupons\/([a-zA-Z0-9_-]+)$/)[1];
      const payload = { ...data, updated_at: new Date().toISOString() };
      delete payload.id;
      const doc = await databases.updateDocument(DATABASE_ID, "coupons", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "DELETE" && path.match(/^\/admin\/coupons\/([a-zA-Z0-9_-]+)$/)) {
      const id = path.match(/^\/admin\/coupons\/([a-zA-Z0-9_-]+)$/)[1];
      await databases.deleteDocument(DATABASE_ID, "coupons", id);
      return { data: { message: "Deleted" } };
    }

    if (method === "GET" && path === "/admin/subscriber-benefits") {
      return { data: { benefits: subscriberBenefits } };
    }

    if (method === "PUT" && path === "/admin/subscriber-benefits") {
      subscriberBenefits = data.benefits || [];
      return { data: { message: "Subscriber benefits updated", benefits: subscriberBenefits } };
    }

    // ==========================================
    // DELIVERY FLOWS
    // ==========================================
    if (method === "GET" && path === "/delivery/orders") {
      const authUser = await getCurrentUser();
      if (!authUser) return { data: [] };
      const queries = [
        Query.equal("rider", authUser.$id),
        Query.limit(100),
      ];
      if (params?.status && params.status !== "active") {
        queries.push(Query.equal("status", params.status));
      }
      const list = await databases.listDocuments(DATABASE_ID, "orders", queries);
      
      let matchedDocs = list.documents;
      if (params?.status === "active") {
        matchedDocs = matchedDocs.filter(o => o.status !== "delivered" && o.status !== "cancelled");
      }

      const orders = [];
      for (const o of matchedDocs) {
        let customerDoc = null;
        try {
          customerDoc = typeof o.user === "object" ? o.user : await databases.getDocument(DATABASE_ID, "users", o.user);
        } catch (e) {}
        
        let shippingAddressDoc = null;
        try {
          shippingAddressDoc = typeof o.shipping_address === "object" ? o.shipping_address : await databases.getDocument(DATABASE_ID, "addresses", o.shipping_address);
        } catch (e) {}

        let items = [];
        try {
          const itemsList = await databases.listDocuments(DATABASE_ID, "order_items", [
            Query.equal("order", o.$id),
            Query.limit(20),
          ]);
          items = itemsList.documents.map(it => ({ ...it, id: it.$id }));
        } catch (e) {}

        const customerName = customerDoc?.name || (customerDoc?.email ? customerDoc.email.split("@")[0] : (o.customer_name || "Customer"));
        const customerPhone = customerDoc?.phone || shippingAddressDoc?.phone || o.customer_phone || "";
        const productName = items.length > 0 ? items[0].product_name : (o.product || "Flower Bouquet");
        const productSummary = items.length > 0
          ? (items.length > 1 ? `${items[0].product_name} +${items.length - 1} more` : items[0].product_name)
          : productName;

        let addressObj = null;
        if (shippingAddressDoc) {
          const fullAddr = [shippingAddressDoc.street, shippingAddressDoc.city, shippingAddressDoc.state, shippingAddressDoc.postal_code].filter(Boolean).join(", ");
          addressObj = {
            ...shippingAddressDoc,
            id: shippingAddressDoc.$id,
            full: fullAddr || "Address provided",
          };
        } else if (o.shipping_address) {
          addressObj = {
            full: typeof o.shipping_address === "string" ? o.shipping_address : (o.shipping_address.street || "Address provided"),
          };
        }

        const totalAmount = parseFloat(o.total || 0) || 0;
        const payout = o.delivery_earnings ? parseFloat(o.delivery_earnings) : (parseFloat(o.distance_km || 5) * 30 || 150);

        orders.push({
          ...o,
          id: o.$id,
          user: customerDoc,
          customer: customerName,
          customer_name: customerName,
          customer_phone: customerPhone,
          product: productName,
          product_summary: productSummary,
          items: items,
          address: addressObj,
          shipping_address: addressObj,
          total: totalAmount,
          amount: totalAmount,
          delivery_earnings: payout,
        });
      }
      return { data: orders };
    }

    if (method === "GET" && path === "/delivery/stats") {
      const authUser = await getCurrentUser();
      if (!authUser) return { 
        data: { 
          total_deliveries: 0,
          completed_deliveries: 0,
          completed_today: 0,
          delivered_today: 0,
          pending: 0,
          total_earnings: 0,
          today_earnings: 0,
        } 
      };
      
      const allRiderOrders = await databases.listDocuments(DATABASE_ID, "orders", [
        Query.equal("rider", authUser.$id),
        Query.limit(1000),
      ]);

      const todayStr = new Date().toISOString().slice(0, 10);
      let completedCount = 0;
      let completedToday = 0;
      let pendingCount = 0;
      let totalEarnings = 0;
      let todayEarnings = 0;

      for (const o of allRiderOrders.documents) {
        if (o.status === "delivered") {
          completedCount++;
          const earnings = o.delivery_earnings ? parseFloat(o.delivery_earnings) : (parseFloat(o.distance_km || 5) * 30 || 150);
          totalEarnings += earnings;

          const orderDate = (o.updated_at || o.delivery_date || o.created_at || "").slice(0, 10);
          if (orderDate === todayStr) {
            completedToday++;
            todayEarnings += earnings;
          }
        } else if (o.status !== "cancelled") {
          pendingCount++;
        }
      }

      return {
        data: {
          total_deliveries: completedCount + pendingCount,
          completed_deliveries: completedCount,
          completed_today: completedToday,
          delivered_today: completedToday,
          pending: pendingCount,
          total_earnings: Math.round(totalEarnings),
          today_earnings: Math.round(todayEarnings),
        },
      };
    }

    if (method === "POST" && path === "/delivery/profile") {
      const authUser = await getCurrentUser();
      if (!authUser) throw new MockError("Unauthorized", 401);

      let fields = {};
      if (data instanceof FormData) {
        for (const [key, val] of data.entries()) {
          fields[key] = val;
        }
      } else if (typeof data === "object" && data !== null) {
        fields = { ...data };
      }

      const deliveryProfile = {
        vehicle_type: fields.vehicle_type || "Motorcycle / Scooter",
        vehicle_model: fields.vehicle_model || "Honda Activa 6G",
        license_plate: fields.license_plate || "MH-12-AB-1234",
        license_number: fields.license_number || "DL-1420110012345",
        document_path: fields.document ? "documents/license.pdf" : (fields.document_path || "documents/license.pdf"),
        updated_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`delivery_profile_${authUser.$id}`, JSON.stringify(deliveryProfile));
      } catch (e) {}

      try {
        const userUpdate = {};
        if (fields.name) userUpdate.name = fields.name;
        if (fields.phone) userUpdate.phone = fields.phone;
        if (fields.birthday) userUpdate.birthday = fields.birthday;
        userUpdate.profile_completed = true;
        await databases.updateDocument(DATABASE_ID, "users", authUser.$id, userUpdate);
      } catch (e) {
        console.warn("Could not update user doc:", e);
      }

      return { data: { message: "Profile uploaded successfully.", profile: deliveryProfile } };
    }

    if (method === "PUT" && path.match(/^\/delivery\/orders\/([a-zA-Z0-9_-]+)\/location$/)) {
      const id = path.match(/^\/delivery\/orders\/([a-zA-Z0-9_-]+)\/location$/)[1];
      const payload = { updated_at: new Date().toISOString() };
      if (data.rider_lat !== undefined) payload.rider_lat = parseFloat(data.rider_lat);
      if (data.rider_lng !== undefined) payload.rider_lng = parseFloat(data.rider_lng);
      if (data.estimated_delivery_at !== undefined) payload.estimated_delivery_at = data.estimated_delivery_at;
      
      const doc = await databases.updateDocument(DATABASE_ID, "orders", id, payload);
      return { data: { ...doc, id: doc.$id } };
    }

    if (method === "PUT" && path.match(/^\/delivery\/orders\/([a-zA-Z0-9_-]+)\/delivered$/)) {
      const id = path.match(/^\/delivery\/orders\/([a-zA-Z0-9_-]+)\/delivered$/)[1];
      const dist = parseFloat(data.distance_km || 5);
      const earnings = dist * 30; // ₹30 per km delivery payout
      
      const doc = await databases.updateDocument(DATABASE_ID, "orders", id, {
        status: "delivered",
        distance_km: dist,
        delivery_earnings: earnings,
        updated_at: new Date().toISOString(),
      });
      
      try {
        await databases.createDocument(DATABASE_ID, "notifications", ID.unique(), {
          user: doc.user,
          type: "order_status",
          title: `Order Delivered`,
          body: `Your order ${doc.order_number} has been delivered successfully.`,
          data: JSON.stringify({ order_id: doc.$id, order_number: doc.order_number, status: "delivered" }),
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (e) {}

      return { data: { ...doc, id: doc.$id } };
    }

    throw new MockError(`Endpoint ${method} ${path} not implemented`, 404);
  } catch (err) {
    if (err instanceof MockError) throw err;
    throw new MockError(err.message || "Appwrite request failed", 500);
  }
}

class AxiosMock {
  constructor(clientType = "standard") {
    this.clientType = clientType;
    this.interceptors = {
      request: { use: () => {} },
      response: { use: () => {} },
    };
  }

  async request(config) {
    return routeRequest(config.method, config.url, config.data, config.params, this.clientType);
  }

  async get(url, config = {}) {
    return this.request({ method: "GET", url, params: config.params });
  }

  async post(url, data, config = {}) {
    return this.request({ method: "POST", url, data, headers: config.headers });
  }

  async put(url, data, config = {}) {
    return this.request({ method: "PUT", url, data });
  }

  async delete(url, config = {}) {
    return this.request({ method: "DELETE", url });
  }
}

const apiClient = new AxiosMock("standard");
export default apiClient;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function safeFetch(endpoint, options = {}) {
  const urlsToTry = [
    `${API_BASE_URL}${endpoint}`,
    API_BASE_URL.includes("localhost")
      ? `${API_BASE_URL.replace("localhost", "127.0.0.1")}${endpoint}`
      : `${API_BASE_URL.replace("127.0.0.1", "localhost")}${endpoint}`
  ];

  let lastError = null;
  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.status >= 400) {
        throw new MockError(data.error || data.message || "Request failed", res.status);
      }
      return { data };
    } catch (err) {
      lastError = err;
      if (err instanceof MockError) throw err;
      // If it's a network fetch failure, attempt next URL candidate
    }
  }
  throw lastError || new MockError("Failed to fetch. Server may be unreachable.", 500);
}

export const sendOtp = async (email, purpose) => {
  return safeFetch("/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose })
  });
};

export const verifyOtp = async (email, otp, purpose) => {
  return safeFetch("/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, purpose })
  });
};

export const resetPassword = async (resetToken, password, passwordConfirmation) => {
  return safeFetch("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reset_token: resetToken,
      password,
      password_confirmation: passwordConfirmation
    })
  });
};
