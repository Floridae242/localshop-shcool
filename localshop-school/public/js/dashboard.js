let ADMIN_PASS = '';
document.getElementById('setPass').onclick = ()=>{
  ADMIN_PASS = document.getElementById('adminPass').value || '';
  loadProducts(); loadOrders();
};

function authFetch(url, opts={}){
  opts.headers = Object.assign({}, opts.headers, {'x-admin-pass': ADMIN_PASS, 'Content-Type': 'application/json'});
  return fetch(url, opts);
}

// download buttons
const dl = (url)=>{ window.location = `${url}?admin=${encodeURIComponent(ADMIN_PASS)}`; }
document.getElementById('dlProducts').onclick = (e)=>{ e.preventDefault(); dl('/api/export/products.csv'); };
document.getElementById('dlOrders').onclick = (e)=>{ e.preventDefault(); dl('/api/export/orders.csv'); };

// CRUD products
async function loadProducts(){
  const res = await fetch('/api/products'); const rows = await res.json();
  const tb = document.querySelector('#productAdmin tbody');
  tb.innerHTML = rows.map(p=>`
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick='edit(${JSON.stringify(p)})'>แก้ไข</button>
        <button class="btn btn-sm btn-outline-danger" onclick='del(${p.id})'>ลบ</button>
      </td>
    </tr>`).join('');
}

window.edit = (p)=>{
  const f = document.getElementById('productForm');
  Object.entries(p).forEach(([k,v])=>{ if(f[k]) f[k].value = v; });
}

window.del = async (id)=>{
  if(!confirm('ลบสินค้านี้?')) return;
  const res = await authFetch(`/api/products/${id}`, { method:'DELETE' });
  if(res.ok){ loadProducts(); }
}

const form = document.getElementById('productForm');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id; delete data.id;
  const method = id? 'PUT':'POST';
  const url = id? `/api/products/${id}`: '/api/products';
  const res = await authFetch(url, { method, body: JSON.stringify(data) });
  if(res.ok){ form.reset(); loadProducts(); }
});

document.getElementById('resetBtn').onclick = ()=> form.reset();

// Orders
async function loadOrders(){
  const res = await authFetch('/api/orders'); if(!res.ok) return;
  const rows = await res.json();
  const tb = document.querySelector('#ordersTable tbody');
  tb.innerHTML = rows.map(o=>`
    <tr>
      <td>${o.id}</td>
      <td>${o.buyer_name}</td>
      <td>${o.product_name}</td>
      <td>${o.qty} ${o.unit||''}</td>
      <td>${o.total}</td>
      <td>
        <select class="form-select form-select-sm" onchange='setStatus(${o.id}, this.value)'>
          ${['NEW','CONFIRMED','CANCELLED'].map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td class="text-end"><button class="btn btn-sm btn-outline-secondary" onclick='setStatus(${o.id},"CONFIRMED")'>ยืนยัน</button></td>
    </tr>`).join('');
}

window.setStatus = async (id,status)=>{
  const res = await authFetch(`/api/orders/${id}/status`, { method:'PUT', body: JSON.stringify({status}) });
  if(res.ok){ loadOrders(); }
}
