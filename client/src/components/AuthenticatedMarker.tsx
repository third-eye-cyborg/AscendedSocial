// Authentication marker component for testing
// This hidden div helps automated tests identify authenticated content
export function AuthenticatedMarker() {
  return (
    <div 
      data-testid="authenticated-content" 
      className="hidden"
      aria-hidden="true"
    />
  );
}