import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useSafeActor } from '../hooks/useSafeActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PartnerApplyPage() {
  const navigate = useNavigate();
  const { actor } = useSafeActor();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    skills: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!actor) throw new Error('Actor not available');
      await actor.registerPartner(data.name, data.skills);
      return data;
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Keahlian wajib diisi';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Domisili wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (registerMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white border border-gray-200 shadow-sm rounded-3xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Terima Kasih!</h2>
              <p className="text-gray-700 leading-relaxed">
                Aplikasi Anda telah berhasil dikirim. Tim kami akan menghubungi Anda melalui email atau WhatsApp untuk tahap selanjutnya.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6"
            >
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate({ to: '/' })}>
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
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bergabung dengan Asistenku
            </h1>
            <p className="text-lg text-gray-600">
              Isi formulir di bawah ini untuk mengajukan diri menjadi bagian dari Tim Kerja Asistenku
            </p>
          </div>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Formulir Aplikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900">
                    Nama <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className={`rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className={`rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-gray-900">
                    WhatsApp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="08123456789"
                    className={`rounded-xl ${errors.whatsapp ? 'border-red-500' : ''}`}
                  />
                  {errors.whatsapp && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-gray-900">
                    Keahlian <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    placeholder="Jelaskan keahlian dan pengalaman Anda"
                    rows={4}
                    className={`rounded-xl ${errors.skills ? 'border-red-500' : ''}`}
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.skills}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-900">
                    Domisili (Kota) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Kota tempat tinggal Anda"
                    className={`rounded-xl ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </p>
                  )}
                </div>

                {registerMutation.isError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {registerMutation.error instanceof Error
                        ? registerMutation.error.message
                        : 'Terjadi kesalahan. Silakan coba lagi.'}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-6 text-lg"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Aplikasi'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/asistenku-icon.png"
              alt="Asistenku"
              className="h-12"
            />
          </div>
          <p className="text-sm text-gray-500">
            Asistenku © 2026 - PT Asistenku Digital Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
}
