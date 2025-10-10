export default function DisclaimerBanner() {
  return (
    <div className="bg-cosmic-light/50 border border-primary/20 rounded-xl p-4 mx-4 mb-4">
      <div className="flex items-start space-x-3">
        <i className="fas fa-info-circle text-primary text-lg mt-0.5"></i>
        <div className="flex-1">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Entertainment & Educational Purposes Only:</strong> Ascended Social is a spiritually-themed platform offering entertainment features including AI-generated oracle readings, chakra analysis, and spiritual content. These features are designed for personal reflection, entertainment, and educational exploration. 
            <strong className="text-white ml-1">We do not provide professional spiritual, religious, psychological, medical, or therapeutic advice.</strong> For professional guidance, please consult qualified practitioners in their respective fields.
          </p>
        </div>
      </div>
    </div>
  );
}
