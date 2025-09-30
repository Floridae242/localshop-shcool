fetch('/api/products').then(r=>r.json()).then(rows=>{
  const tb = document.querySelector('#productTable tbody');
  tb.innerHTML = rows.map(p=>`
    <tr>
      <td class="align-middle"><img src="${p.image_url||''}" alt="" width="40" class="me-2">${p.name}</td>
      <td class="align-middle">${p.category}</td>
      <td class="align-middle">${p.unit}</td>
      <td class="align-middle text-end">${Number(p.price).toFixed(2)}</td>
      <td class="align-middle text-end">${p.stock}</td>
    </tr>`).join('');
});
