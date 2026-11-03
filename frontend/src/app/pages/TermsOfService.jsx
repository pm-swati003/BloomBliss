import { Link } from "react-router-dom";

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Terms of Service
          </h1>
          <p className="text-white/90">Last updated: 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-20 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border space-y-6 text-[#6B7280]">
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              1. Acceptance of terms
            </h2>
            <p>
              By using Bloom & Bliss’s website and services, you agree to these
              Terms of Service. If you do not agree, please do not use our site
              or place orders.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              2. Use of the service
            </h2>
            <p>
              You must provide accurate information when creating an account and
              placing orders. You are responsible for keeping your login details
              secure. You may not use our service for any unlawful or abusive
              purpose.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              3. Orders and payment
            </h2>
            <p>
              All orders are subject to availability. We reserve the right to
              refuse or cancel orders. Prices are as shown at checkout. Payment
              is due at the time of order unless otherwise stated.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">4. Delivery</h2>
            <p>
              Delivery times are estimates. We are not liable for delays due to
              circumstances beyond our control. Risk of loss passes to you upon
              delivery to the address you provided.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              5. Returns and refunds
            </h2>
            <p>
              Our return and refund policy is described on our site and at
              checkout. Damaged or incorrect items should be reported within 48
              hours. Refunds are processed in accordance with our policy.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              6. Intellectual property
            </h2>
            <p>
              All content on this site—including text, images, and logos—is
              owned by Bloom & Bliss or its licensors and may not be copied or
              used without permission.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">7. Contact</h2>
            <p>
              For questions about these terms, please visit our{" "}
              <Link to="/contact" className="text-[#E91E8C] hover:underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
