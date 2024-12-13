import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid2
} from '@mui/material';
import Image from 'next/image';

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
          Tentang Kami
        </Typography>
        <Typography variant="body2" color="text.secondary">
          HOME / ABOUT US
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Content Sections */}
      <Grid2 container spacing={4}>
        <Grid2 xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body1" paragraph>
                Dengan penuh rasa syukur dan antusiasme, kami menyampaikan bahwa project pengembangan website untuk usaha Fotocopy Ngagel 97 telah berhasil diselesaikan. Project ini merupakan bentuk komitmen kami dalam mendukung usaha kecil dan menengah untuk beradaptasi dengan perkembangan teknologi digital yang semakin pesat. Dalam era yang serba digital ini, kebutuhan untuk melakukan transaksi secara daring semakin meningkat, dan kami berharap dengan adanya website ini, Fotocopy Ngagel 97 dapat memberikan layanan yang lebih cepat, mudah, dan efisien kepada pelanggannya.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body1" paragraph>
                Fotocopy Ngagel 97 adalah usaha percetakan yang telah berdiri sejak tahun 1997 dan berlokasi di Jalan Ngagel Jaya Tengah, Surabaya. Selama hampir 30 tahun, usaha ini telah memberikan pelayanan terbaiknya kepada mahasiswa dan masyarakat sekitar, terutama dalam hal pencetakan dokumen penting. Namun, seiring dengan berjalannya waktu dan perkembangan teknologi, sistem manual yang masih digunakan saat ini dirasa kurang optimal dalam melayani pelanggan yang semakin dinamis dan membutuhkan kemudahan transaksi.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body1" paragraph>
                Project ini hadir sebagai solusi untuk memudahkan pengelolaan pesanan, memperkecil kesalahan manusia dalam pencatatan transaksi, serta memperluas jangkauan pelanggan melalui platform daring. Dengan adanya website ini, pelanggan dapat memesan layanan percetakan dan pembelian alat tulis secara online tanpa harus datang langsung ke lokasi. Hal ini diharapkan dapat meningkatkan efisiensi dan menambah keuntungan bagi usaha Fotocopy Ngagel 97.
              </Typography>
              <Typography variant="body1" paragraph>
                Pembuatan website ini melibatkan berbagai tahapan mulai dari analisis kebutuhan, desain antarmuka pengguna, hingga implementasi sistem pemesanan daring yang terintegrasi. Kami berupaya menghadirkan solusi teknologi yang user-friendly dan sesuai dengan kebutuhan usaha Fotocopy Ngagel 97 serta para pelanggannya, terutama mahasiswa yang memerlukan layanan cepat dan praktis.
              </Typography>
              <Typography variant="body1" paragraph>
                Akhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah mendukung terselenggaranya project ini. Semoga website yang telah dikembangkan ini dapat memberikan manfaat yang besar bagi Fotocopy Ngagel 97 dan menjadi awal yang baik untuk pengembangan usaha di masa depan.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Map Section */}
      <Box mt={6}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Lokasi Kami
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5410.718308485194!2d112.75547871177554!3d-7.291479892685609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbb3f16cf801%3A0x2fd8ffe8c4fad9d1!2sVindi%20Copy%20Service!5e1!3m2!1sen!2sid!4v1733919511277!5m2!1sen!2sid"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AboutUsPage;
