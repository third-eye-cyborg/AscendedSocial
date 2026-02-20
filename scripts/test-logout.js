(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
    console.log('status', res.status);
    const body = await res.text();
    console.log('body:', body);
  } catch (err) {
    console.error('error:', err);
    process.exit(1);
  }
})();