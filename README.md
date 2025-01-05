# Rutin Takip Uygulaması

Bu uygulama, günlük, haftalık veya aylık rutinlerinizi takip etmenize yardımcı olan bir mobil uygulamadır. React Native ve Expo ile geliştirilmiştir.

## Özellikler

- 📝 Görev oluşturma ve düzenleme
- 🔄 Özelleştirilebilir görev sıklığı (günlük, haftalık, aylık)
- ✅ Görev tamamlama durumu takibi
- 📊 Geçmiş ve gelecek görev durumlarını görüntüleme
- 🌓 Açık/koyu tema desteği
- 💾 Yerel depolama ile veri saklama
- 📱 Kullanıcı dostu arayüz

## Teknolojiler

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Navigation
- date-fns
- React Native Gesture Handler

## Başlangıç

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS için Xcode (sadece macOS)
- Android için Android Studio

### Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd routine-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Uygulamayı başlatın:
```bash
npx expo start
```

## Kullanım

### Görev Ekleme
1. Ana ekrandaki + butonuna tıklayın
2. Görev adını girin
3. Görev sıklığını seçin (gün, hafta, ay)
4. Sıklık değerini girin
5. Kaydet butonuna tıklayın

### Görev Tamamlama
- İlgili tarihteki görev kutucuğuna tıklayarak görevi tamamlandı olarak işaretleyin
- Tekrar tıklayarak tamamlanma durumunu geri alın

### Görev Düzenleme
1. Görev kartındaki "Düzenle" butonuna tıklayın
2. Gerekli değişiklikleri yapın
3. Kaydet butonuna tıklayın

### Görev Silme
- Görev kartını sola kaydırın ve "Sil" butonuna tıklayın

### Tema Değiştirme
1. Ayarlar sekmesine gidin
2. "Görünüm" bölümünden istediğiniz temayı seçin:
   - Açık Tema
   - Koyu Tema
   - Sistem Teması

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Değişikliklerinizi commit edin (\`git commit -m 'Add some amazing feature'\`)
4. Branch'inizi push edin (\`git push origin feature/amazing-feature\`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için \`LICENSE\` dosyasına bakın.
