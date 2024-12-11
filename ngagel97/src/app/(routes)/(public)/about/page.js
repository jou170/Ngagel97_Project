import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider } from '@mui/material';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <Image 
          src="/assets/fotocopy-ngagel-97-logo.png" 
          alt="Fotocopy Ngagel 97 Logo" 
          width={150} 
          height={150} 
        />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Tentang Kami
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Dengan penuh rasa syukur dan antusiasme, kami menyampaikan bahwa project pengembangan website untuk usaha Fotocopy Ngagel 97 telah berhasil diselesaikan. Project ini merupakan bentuk komitmen kami dalam mendukung usaha kecil dan menengah untuk beradaptasi dengan perkembangan teknologi digital yang semakin pesat. Dalam era yang serba digital ini, kebutuhan untuk melakukan transaksi secara daring semakin meningkat, dan kami berharap dengan adanya website ini, Fotocopy Ngagel 97 dapat memberikan layanan yang lebih cepat, mudah, dan efisien kepada pelanggannya.
          </Typography>
        </CardContent>
      </Card>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Fotocopy Ngagel 97 adalah usaha percetakan yang telah berdiri sejak tahun 1997 dan berlokasi di Jalan Ngagel Jaya Tengah, Surabaya. Selama hampir 30 tahun, usaha ini telah memberikan pelayanan terbaiknya kepada mahasiswa dan masyarakat sekitar, terutama dalam hal pencetakan dokumen penting. Namun, seiring dengan berjalannya waktu dan perkembangan teknologi, sistem manual yang masih digunakan saat ini dirasa kurang optimal dalam melayani pelanggan yang semakin dinamis dan membutuhkan kemudahan transaksi.
          </Typography>
        </CardContent>
      </Card>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Project ini hadir sebagai solusi untuk memudahkan pengelolaan pesanan, memperkecil kesalahan manusia dalam pencatatan transaksi, serta memperluas jangkauan pelanggan melalui platform daring. Dengan adanya website ini, pelanggan dapat memesan layanan percetakan dan pembelian alat tulis secara online tanpa harus datang langsung ke lokasi. Hal ini diharapkan dapat meningkatkan efisiensi dan menambah keuntungan bagi usaha Fotocopy Ngagel 97.
          </Typography>
        </CardContent>
      </Card>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Pembuatan website ini melibatkan berbagai tahapan mulai dari analisis kebutuhan, desain antarmuka pengguna, hingga implementasi sistem pemesanan daring yang terintegrasi. Kami berupaya menghadirkan solusi teknologi yang user-friendly dan sesuai dengan kebutuhan usaha Fotocopy Ngagel 97 serta para pelanggannya, terutama mahasiswa yang memerlukan layanan cepat dan praktis.
          </Typography>
          <Typography variant="body1" paragraph>
            Akhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah mendukung terselenggaranya project ini. Semoga website yang telah dikembangkan ini dapat memberikan manfaat yang besar bagi Fotocopy Ngagel 97 dan menjadi awal yang baik untuk pengembangan usaha di masa depan.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutPage;