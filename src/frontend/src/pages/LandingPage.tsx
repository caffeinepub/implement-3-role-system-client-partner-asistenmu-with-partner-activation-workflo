import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDomainRole } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import MasukButton from '../components/MasukButton';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: domainRole, isLoading: roleLoading, isFetched } = useGetDomainRole();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Only navigate if authenticated AND has a valid domain role AND hasn't navigated yet
    if (identity && isFetched && domainRole && !roleLoading && !hasNavigated) {
      setHasNavigated(true);
      navigate({ to: '/dashboard' });
    }
  }, [identity, domainRole, isFetched, roleLoading, navigate, hasNavigated]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappBase = 'https://wa.me/+6281774361';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Translucent White */}
      <header className="header-translucent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/asistenku-horizontal.png"
              alt="Asistenku"
              className="h-14 hidden md:block"
            />
            <img
              src="/assets/asistenku-icon.png"
              alt="Asistenku"
              className="h-14 md:hidden"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
            >
              Layanan untuk Saya
            </button>
            <button
              onClick={() => navigate({ to: '/bergabung-menjadi-partner' })}
              className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
            >
              Bergabung dengan Asistenku
            </button>
          </nav>
          <MasukButton className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section id="hero" className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Tenang menjalani hari,<br />
                Didampingi oleh Asistenmu dengan rapi.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Asistenku hadir untuk menemani keseharian Anda — supaya energi kamu bisa digunakan untuk hal yang lebih penting.
              </p>
              <a
                href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh didampingi')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg shadow-lg">
                  Ngobrol dulu
                </Button>
              </a>
            </div>
            <div className="flex justify-center">
              <img
                src="/assets/Hero visual.png"
                alt="Asistenku Hero"
                className="w-full max-w-lg rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* Kebutuhan yang Unik Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kebutuhan yang Unik</h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Setiap orang memiliki kebutuhan yang berbeda. Ada yang sedang sibuk membangun bisnis, ada yang ingin lebih fokus pada keluarga, ada yang butuh ruang untuk berpikir strategis.
              </p>
              <p>
                Asistenku hadir bukan untuk mempercepat, tapi untuk menemani. Kami memahami bahwa setiap fase kehidupan memerlukan pendampingan yang berbeda.
              </p>
              <p>
                Kami tidak terburu-buru. Kami hadir untuk memastikan kamu bisa menjalani hari dengan lebih tenang dan rapi.
              </p>
            </div>
          </div>
        </section>

        {/* Layanan untuk Saya Section */}
        <section id="layanan" className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Layanan untuk Saya</h2>
              <p className="text-xl text-gray-600">
                Pilih layanan yang sesuai dengan fase hidup dan bisnis Anda saat ini
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tenang Card */}
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Tenang 🧘</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Saat kamu sibuk dalam artian positif, kamu ingin lebih tenang menjalankan keseharian. Asistenmu mendampingi hal-hal rutinitas, supaya energimu bisa kembali untuk hal lainnya—yang penting buatmu.
                  </p>
                  <p className="text-sm text-gray-500">Mulai dari Rp 3.500.000 / bulan</p>
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh ngobrol tentang layanan Tenang')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6">
                      Ngobrol dulu
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Rapi Card */}
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Rapi 🗂️</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Saat hidupmu sudah lebih tenang, kamu mulai merapikan dan menyeimbangkan kehidupan pribadi dan bisnis. Supaya keduanya tidak saling bertabrakan, dan kamu tetap bisa mengambil waktu untuk hal yang penting buatmu—entah itu keluarga, pasangan, diri sendiri, atau sekadar berhenti sebentar.
                  </p>
                  <p className="text-sm text-gray-500">Mulai dari Rp 5.000.000 / bulan</p>
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh ngobrol tentang layanan Rapi')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6">
                      Ngobrol dulu
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Fokus Card */}
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Fokus 🎯</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Saat semuanya mulai rapi, kamu ingin menjaga perhatian tetap di hal yang paling penting. Bukan karena kurang kerja keras, tapi karena kamu butuh ruang untuk berpikir, memutuskan, dan bergerak tanpa terganggu hal kecil yang menguras fokus.
                  </p>
                  <p className="text-sm text-gray-500">Mulai dari Rp 8.500.000 / bulan</p>
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh ngobrol tentang layanan Fokus')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6">
                      Ngobrol dulu
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Jaga Card */}
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Jaga 🛡️</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Saat bisnis sudah berjalan, kamu ingin menjaganya tetap stabil dan membaik—tanpa harus memantau terus-menerus. Ada yang memastikan detailnya tertangani dengan rapi, jadi kamu tidak pusing berhadapan dengan orang yang datang dan pergi.
                  </p>
                  <p className="text-sm text-gray-500">Mulai dari Rp 12.000.000 / bulan</p>
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh ngobrol tentang layanan Jaga')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6">
                      Ngobrol dulu
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Menanggung Sendiri atau Didampingi?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Menanggung Sendiri</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Kamu mengurus semua detail sendiri—dari hal kecil sampai yang besar.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Energi terkuras untuk hal-hal rutinitas yang sebenarnya bisa didelegasikan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Waktu untuk berpikir strategis atau sekadar istirahat jadi berkurang.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Risiko burnout meningkat karena beban yang terus bertambah.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Didampingi</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span>Ada yang membantu menangani rutinitas dan detail operasional.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span>Energi bisa dialokasikan untuk hal yang lebih penting dan strategis.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span>Kamu jadi punya ruang untuk berpikir, memutuskan, dan beristirahat.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span>Sistem yang rapi dan konsisten membantu menjaga stabilitas jangka panjang.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <a
                href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh didampingi')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg shadow-lg">
                  Ngobrol dulu
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-gray-200 rounded-2xl px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  Apakah ini cocok kalau saya belum yakin dengan kebutuhan saya?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  Justru itu. Kita mulai dari ngobrol dulu.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border border-gray-200 rounded-2xl px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  Apakah saya harus memilih satu layanan saja?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  Tidak. Kamu bisa memilih lebih dari satu layanan disesuaikan dengan fase kehidupanmu sekarang.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border border-gray-200 rounded-2xl px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  Apakah ini pengganti karyawan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  Tidak. Ini pendampingan untukmu ada Asistenmu yang akan membantu delegasi layanan dan Tim Asistenku yang akan mengerjakan tugas yang kamu minta.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="text-center mt-8">
              <a
                href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh didampingi')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6">
                  Ngobrol dulu
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Bergabung Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Bergabung dengan Asistenku
            </h2>
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl">
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      Anda dapat mengajukan diri untuk menjadi bagian dari Tim Kerja Asistenku.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      Tahapan seleksi dan kurasi akan dilakukan sebelum bergabung.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      Anda tidak perlu mencari pekerjaan sendiri, karena permintaan klien dikoordinasikan melalui Asistenmu.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      Sistem kerja dan pengupahan yang adil, mengikuti praktik kerja yang berlaku di Indonesia.
                    </span>
                  </li>
                </ul>
                <Button
                  onClick={() => navigate({ to: '/bergabung-menjadi-partner' })}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6"
                >
                  saya ingin bergabung
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <img
                src="/assets/asistenku-icon.png"
                alt="Asistenku"
                className="h-16"
              />
            </div>
            <p className="text-gray-700 leading-relaxed">
              Kami percaya kebutuhan setiap orang itu unik. Kalau kamu sampai di sini, mungkin ini saat yang tepat untuk ngobrol.
            </p>
            <a
              href={`${whatsappBase}?text=${encodeURIComponent('Hai Asistenku, Saya butuh didampingi')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-teal-600 hover:text-teal-700 font-medium"
            >
              Hubungi kami via WhatsApp
            </a>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <button className="hover:text-teal-600 transition-colors">Syarat & Ketentuan</button>
              <button className="hover:text-teal-600 transition-colors">Kebijakan Privasi</button>
            </div>
            <p className="text-sm text-gray-500">
              Asistenku © 2026 - PT Asistenku Digital Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
