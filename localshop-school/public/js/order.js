fetch('/api/products').then(r=>r.json()).then(list=>{
  const sel = document.getElementById('productSelect');
  sel.innerHTML = '<option value="">เลือกสินค้า</option>' + list.map(p=>`<option value="${p.id}">${p.name} — ${p.price}/${p.unit}</option>`).join('');
});

const form = document.getElementById('orderForm');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  const out = document.getElementById('msg');
  if(res.ok){ const j = await res.json(); out.innerHTML = `<div class="alert alert-success">สั่งซื้อสำเร็จ ยอดรวม ${j.total.toFixed(2)} บาท</div>`; form.reset(); }
  else { out.innerHTML = `<div class="alert alert-danger">สั่งซื้อไม่สำเร็จ</div>`; }
});
