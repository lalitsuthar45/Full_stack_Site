import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600">
            Visit us or get in touch for any query
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">
                    123 Siyana avenue, Jalore District
                    <br />
                   rajasthan, 343024
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">+91 7878037679 </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@savoryhaven.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 11:00 AM - 10:00 PM
                    <br />
                    Saturday - Sunday: 10:00 AM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="tel:+7878037679"
                className="text-center bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
              >
                Call Now
              </a>

              <a
                href="mailto:info@savoryhaven.com"
                className="text-center bg-white text-amber-600 border-2 border-amber-600 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
              >
                Email
              </a>

              <a
                href="https://wa.me/7878037679"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[420px]">
            <iframe
              src="https://www.google.com/maps?q=Jalore,+Rajasthan,+India&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Restaurant location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}