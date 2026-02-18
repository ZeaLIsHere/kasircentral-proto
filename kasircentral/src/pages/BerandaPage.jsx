import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../config/firebase'

function BerandaPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')
  const navigate = useNavigate()

  const loadProducts = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'))
      const list = []
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }))
      setProducts(list.filter((p) => p.isActive !== false))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOpenTambahProduk = () => {
    setNewName('')
    setNewPrice('')
    setNewStock('')
    setAdding(true)
  }

  const handleSimpanProdukBaru = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'products'), {
        name: newName,
        price: Number(newPrice || 0),
        stock: Number(newStock || 0),
        isActive: true,
      })
      setAdding(false)
      await loadProducts()
    } catch (err) {
      console.error(err)
      alert('Gagal menambah produk')
    }
  }

  const handleTambahKeKeranjang = (productId) => {
    navigate('/kasir', { state: { addProductId: productId } })
  }

  if (loading) {
    return (
      <main className="kc-main">
        <div className="kc-glass-card" style={{ padding: 16 }}>Memuat data...</div>
      </main>
    )
  }

  const kosong = products.length === 0

  return (
    <main className="kc-main">
      <div className="kc-glass-card" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Beranda</h2>
            <div className="kc-product-grid">
              {products.map((p) => (
                <div key={p.id} className="kc-product-card">
                  <div className="kc-product-title">{p.name}</div>
                  <div className="kc-product-price">Rp {p.price.toLocaleString('id-ID')}</div>
                  <div className="kc-product-stock">Stok: {p.stock}</div>
                  <button
                    className="kc-nav-logout kc-product-cta"
                    onClick={() => handleTambahKeKeranjang(p.id)}
                  >
                    Beli sekarang
                  </button>
                </div>
              ))}
            </div>
                  <div style={{ fontWeight: 600, fontSize: '20px', marginBottom: 4, color: '#212529' }}>{p.name}</div>
                  <div style={{ fontSize: '17px', color: '#6c757d' }}>Rp {p.price.toLocaleString('id-ID')}</div>
                  <div style={{ fontSize: '15px', color: '#212223ff', marginBottom: 8 }}>Stok: {p.stock}</div>
                  <button
                    className="kc-nav-logout"
                    style={{ width: '100%' }}
                    onClick={() => handleTambahKeKeranjang(p.id)}
                  >
                    Beli sekarang
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {adding && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
          }}
        >
          <div className="kc-glass-card" style={{ padding: 16, width: '90%', maxWidth: 360 }}>
            <h3 style={{ marginTop: 0 }}>Tambah Produk</h3>
            <form onSubmit={handleSimpanProdukBaru}>
              <div style={{ marginBottom: 10 }}>
                <label className="kc-label">Nama produk</label>
                <input
                  className="kc-input"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="kc-label">Harga</label>
                <input
                  className="kc-input"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="kc-label">Stok awal</label>
                <input
                  className="kc-input"
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="kc-nav-logout" style={{ flex: 1 }} onClick={() => setAdding(false)}>
                  Batal
                </button>
                <button type="submit" className="kc-button-primary" style={{ flex: 1 }}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default BerandaPage
