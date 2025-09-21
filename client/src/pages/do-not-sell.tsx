import { useState } from "react";

export default function DoNotSell() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    requestType: 'opt-out',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('CCPA request submitted:', formData);
    setFormSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/80 backdrop-blur-2xl border-b border-primary/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <i className="fas fa-user-shield text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Do Not Sell My Info</span>
                  <span className="sm:hidden">CCPA</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">PRIVACY • RIGHTS • CONTROL</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105"
                data-testid="button-home"
              >
                <span className="relative z-10">Back to Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                CCPA - Do Not Sell My Personal Information
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              California residents have the right to opt-out of the sale of their personal information under the California Consumer Privacy Act (CCPA).
            </p>
          </div>

          {/* CCPA Request Form */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="ccpa-request-form">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-display font-bold mb-4 text-primary">Submit Your CCPA Request</h3>
                  <p className="text-white/80">
                    California residents can request that we do not sell their personal information. Complete the form below to exercise your rights.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-cosmic/50 border border-primary/30 rounded-xl text-white placeholder-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="your.email@example.com"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium text-white/90 mb-2">
                      Request Type *
                    </label>
                    <select
                      id="requestType"
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-cosmic/50 border border-primary/30 rounded-xl text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      data-testid="select-request-type"
                    >
                      <option value="opt-out">Do Not Sell My Personal Information</option>
                      <option value="delete">Delete My Personal Information</option>
                      <option value="access">Access My Personal Information</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-white/90 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-cosmic/50 border border-primary/30 rounded-xl text-white placeholder-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      placeholder="Please provide any additional details about your request..."
                      data-testid="textarea-reason"
                    />
                  </div>
                </div>

                <div className="text-center pt-6">
                  <button
                    type="submit"
                    className="group relative bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 text-lg inline-flex items-center space-x-2"
                    data-testid="button-submit-ccpa-request"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <i className="fas fa-paper-plane"></i>
                      <span>Submit Request</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12" data-testid="ccpa-form-success">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-green-400">Request Submitted Successfully</h3>
                <p className="text-white/80 leading-relaxed max-w-md mx-auto">
                  Thank you for submitting your CCPA request. We will process your request within 45 days as required by California law and send a confirmation to your email address.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 bg-primary/20 hover:bg-primary/30 text-primary font-semibold px-6 py-2 rounded-xl transition-colors duration-300"
                  data-testid="button-submit-another"
                >
                  Submit Another Request
                </button>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-gavel text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Your CCPA Rights</h3>
              <p className="text-white/90 leading-relaxed">
                Under CCPA, California residents have the right to know what personal information is collected, request deletion of personal information, and opt-out of the sale of personal information.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-user-lock text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">How We Protect You</h3>
              <p className="text-white/90 leading-relaxed">
                We respect your privacy choices and make it easy to exercise your rights. Your opt-out preferences are processed immediately and apply to all future data processing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}