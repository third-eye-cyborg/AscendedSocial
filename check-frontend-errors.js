// Frontend error checking script
// This script will help identify potential issues with the frontend

console.log('🔍 Frontend Error Check Started');

// Check 1: Verify window object and location
console.log('✅ Window object available:', typeof window !== 'undefined');
console.log('✅ Window.location available:', typeof window.location !== 'undefined');
console.log('✅ Current location:', window.location.href);

// Check 2: Test if we can set window.location.href
console.log('🧪 Testing window.location.href assignment...');
const originalHref = window.location.href;
try {
    // Try to set location to current URL (should be safe)
    window.location.href = originalHref + '#test';
    console.log('✅ window.location.href assignment works');
    
    // Reset location
    setTimeout(() => {
        window.location.href = originalHref;
    }, 10);
} catch (error) {
    console.error('❌ Error setting window.location.href:', error);
}

// Check 3: Test fetch to auth endpoint
console.log('🧪 Testing fetch to auth endpoint...');
fetch('/api/login', {
    method: 'HEAD',
    redirect: 'manual'
}).then(response => {
    console.log('✅ Auth endpoint response status:', response.status);
    console.log('✅ Auth endpoint response type:', response.type);
    if (response.status === 0 && response.type === 'opaqueredirect') {
        console.log('✅ Auth endpoint correctly returns redirect');
    }
}).catch(error => {
    console.error('❌ Error fetching auth endpoint:', error);
});

// Check 4: Look for JavaScript errors
window.addEventListener('error', function(event) {
    console.error('❌ JavaScript Error detected:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

console.log('🔍 Frontend Error Check Completed');