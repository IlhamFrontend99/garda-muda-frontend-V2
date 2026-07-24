import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Ganti URL Backend sesuai Vercel
const API_URL = 'https://backend81.vercel.app';

export function useGardaData() {
  const [lombas, setLombas] = useState([]);
  const [pendaftars, setPendaftars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Lombas
      const resLombas = await axios.get(`${API_URL}/api/lombas`);
      const dataLombas = Array.isArray(resLombas.data) ? resLombas.data : (resLombas.data?.data || []);
      setLombas(dataLombas);

      // Fetch Pendaftars
      const resPendaftars = await axios.get(`${API_URL}/api/pendaftars`);
      const dataPendaftars = Array.isArray(resPendaftars.data) ? resPendaftars.data : (resPendaftars.data?.data || []);
      setPendaftars(dataPendaftars);

    } catch (err) {
      console.error('❌ Gagal ambil data backend, fallback ke localStorage:', err);
      const localLombas = JSON.parse(localStorage.getItem('gm_lombas_db') || '[]');
      const localPendaftars = JSON.parse(localStorage.getItem('gm_pendaftars_db') || '[]');
      setLombas(localLombas);
      setPendaftars(localPendaftars);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { lombas, pendaftars, loading, refetch: fetchData };
}
