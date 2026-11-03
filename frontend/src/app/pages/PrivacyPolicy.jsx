import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-white/90">Last updated: 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-20 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border space-y-6 text-[#6B7280]">
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              1. Information we collect
            </h2>
            <p>
              We collect information you provide when you register, place an
              order, or contact us—such as name, email, phone, delivery address,
              and payment details. We also collect usage data to improve our
              site and services.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              2. How we use your information
            </h2>
            <p>
              We use your information to process orders, send order and delivery
              updates, respond to inquiries, improve our products and services,
              and send promotional communications if you have opted in.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              3. Sharing of information
            </h2>
            <p>
              We do not sell your personal information. We may share data with
              service providers who help us operate our business (e.g. payment
              processors, delivery partners) under strict confidentiality
              agreements.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">4. Security</h2>
            <p>
              We use industry-standard measures to protect your personal and
              payment information. Sensitive data is encrypted in transit and at
              rest.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">
              5. Your rights
            </h2>
            <p>
              You may access, correct, or delete your personal data through your
              account settings or by contacting us. You may also opt out of
              marketing emails at any time.
            </p>
          </section>
          <section>
            <h2 className="text-[#1F2937] font-semibold mb-2">6. Contact</h2>
            <p>
              For privacy-related questions, please contact us via our{" "}
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
