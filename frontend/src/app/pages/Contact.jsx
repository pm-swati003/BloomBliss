import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full bg-gradient-to-r from-[#E91E8C] via-[#FF1F8F] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <h1 className="text-white mb-4">Contact Us</h1>
          <p className="text-white/90">
            We'd love to hear from you. Reach out to us anytime!
          </p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-20 py-20">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-4">
            <h2 className="text-[#1F2937] mb-8">Get in Touch</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3>Phone</h3>
                  <p>+82 2-1234-5678</p>
                  <p>+82 10-9876-5432</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h3>Email</h3>
                  <p>info@bloomandbliss.com</p>
                  <p>support@bloomandbliss.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3>Address</h3>
                  <p>123 Flower Street, Gangnam-gu, Seoul, South Korea 06000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="w-full h-64 bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#E91E8C]">[Google Maps]</span>
            </div>
          </div>
          <div className="col-span-8">
            <div className="bg-[#F9FAFB] rounded-lg p-8 shadow-md">
              <h2 className="text-[#1F2937] mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label>Subject *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="custom">Custom Arrangement</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label>Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#E91E8C] text-white rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#FFF5F7] py-20">
        <div className="max-w-[1440px] mx-auto px-20">
          <h2 className="text-[#1F2937] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-[#E91E8C] mb-2">
                Do you offer same-day delivery?
              </h3>
              <p>Yes! Order before 2 PM for same-day delivery in Seoul.</p>
            </div>
            <div>
              <h3 className="text-[#E91E8C] mb-2">
                Can I customize my bouquet?
              </h3>
              <p>
                Absolutely! Contact us to create a personalized arrangement.
              </p>
            </div>
            <div>
              <h3 className="text-[#E91E8C] mb-2">
                What is your return policy?
              </h3>
              <p>
                We guarantee 100% freshness. Contact us within 24 hours if
                you're not satisfied.
              </p>
            </div>
            <div>
              <h3 className="text-[#E91E8C] mb-2">
                Do you deliver outside Seoul?
              </h3>
              <p>
                Yes, we deliver nationwide. Delivery times may vary by location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
