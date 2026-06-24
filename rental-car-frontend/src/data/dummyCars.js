const carImages = {
    'Toyota Avanza': new URL('../assets/avanza.jpg', import.meta.url).href,
    'Honda Civic': new URL('../assets/civic.jpg', import.meta.url).href,
    'Mitsubishi Xpander': new URL('../assets/xpander.jpg', import.meta.url).href,
    'Toyota Fortuner': new URL('../assets/fortuner.jpg', import.meta.url).href,
    'Suzuki Ertiga': new URL('../assets/ertiga.jpg', import.meta.url).href,
    'Honda Brio': new URL('../assets/brio.jpg', import.meta.url).href,
    'Hatchback': new URL('../assets/hatchback.jpg', import.meta.url).href,
    'Mitsubishi Pajero': new URL('../assets/pajero.jpg', import.meta.url).href,
    'Toyota Raize': new URL('../assets/raize.jpg', import.meta.url).href,
    'Daihatsu Sigra': new URL('../assets/sigra.jpg', import.meta.url).href,
    'Toyota Zenix': new URL('../assets/zenix.jpg', import.meta.url).href,
};

export const getCarImage = (name) => carImages[name] || carImages['Hatchback'];

export const dummyCars = [
    {
        id: 1,
        nama: 'Toyota Avanza',
        tipe: 'SUV',
        harga: 350000,
        status: 'Tersedia',
        gambar: getCarImage('Toyota Avanza'),
        spek: 'Plat: B 1234 ABC',
        Deskripsi: 'Toyota Avanza nyaman untuk keluarga, cocok untuk perjalanan jauh dengan konsumsi bahan bakar efisien.',
    },
    {
        id: 2,
        nama: 'Honda Civic',
        tipe: 'Sedan',
        harga: 700000,
        status: 'Tersedia',
        gambar: getCarImage('Honda Civic'),
        spek: 'Plat: B 9999 XYZ',
        Deskripsi: 'Honda Civic elegan dan sporty, ideal untuk tampilan premium saat perjalanan bisnis.',
    },
    {
        id: 3,
        nama: 'Mitsubishi Xpander',
        tipe: 'MPV',
        harga: 450000,
        status: 'Tersedia',
        gambar: getCarImage('Mitsubishi Xpander'),
        spek: 'Plat: B 2233 ZXC',
        Deskripsi: 'Xpander luas dengan kabin nyaman, cocok untuk keluarga besar dan liburan panjang.',
    },
];
