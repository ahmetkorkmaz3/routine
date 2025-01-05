# Katkıda Bulunma Rehberi

## Geliştirme Ortamının Kurulumu

1. Projeyi klonlayın:
```bash
git clone https://github.com/[kullanıcı-adı]/routine-app.git
cd routine-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

## Kod Standartları

- TypeScript kullanın
- ESLint kurallarına uyun
- Komponenetleri modüler tutun
- Tema desteğini koruyun
- Erişilebilirlik standartlarına uyun

## Pull Request Süreci

1. Yeni bir branch oluşturun:
```bash
git checkout -b feature/yeni-ozellik
```

2. Değişikliklerinizi commit'leyin:
```bash
git commit -m "feat: yeni özellik eklendi"
```

3. Branch'inizi push'layın:
```bash
git push origin feature/yeni-ozellik
```

4. Pull request açın ve değişikliklerinizi açıklayın

## Commit Mesajları

Commit mesajlarınızı [Conventional Commits](https://www.conventionalcommits.org/) standardına göre yazın:

- `feat:` - Yeni özellik
- `fix:` - Hata düzeltmesi
- `docs:` - Dokümantasyon değişiklikleri
- `style:` - Kod formatı değişiklikleri
- `refactor:` - Kod yeniden düzenleme
- `test:` - Test ekleme veya düzenleme
- `chore:` - Yapılandırma değişiklikleri

## Test

- Yeni özellikler için testler ekleyin
- Mevcut testlerin geçtiğinden emin olun
- UI değişiklikleri için ekran görüntüleri ekleyin

## Sorular?

Herhangi bir sorunuz varsa, issue açarak yardım isteyebilirsiniz. 