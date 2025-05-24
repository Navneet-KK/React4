const searchInput = document.getElementById('search');
const resultDiv = document.getElementById('result');

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    resultDiv.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    // Build result list with name and image side by side
    resultDiv.innerHTML = data.map(item => `
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
        <img src="${item.url}" alt="${item.name}" style="width: 100px; height: auto; object-fit: cover; border-radius: 5px;">
        <p style="margin: 0; font-size: 18px;">${item.name}</p>
      </div>
    `).join('');
  } catch {
    resultDiv.innerHTML = '<p>No match found</p>';
  }
});
