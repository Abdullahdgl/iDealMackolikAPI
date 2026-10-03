# iDealMackolik
Serie A tarzı bir lig ekranı. İki projeden oluşur: veri `iDealMackolikAPI` içindedir, sayfalar `iDealMackolicUI` içindedir. Arayüz, API’ye `https://localhost:XXX` adresinden istek atar.
Hedef çerçeve .NET 6’dır.
## Projeler
| Klasör | Ne işe yarar | Adres |
|---|---|---|
| `iDealMackolikAPI` | Entity Framework Core, SQL Server, Swagger | `https://localhost:XXX` |
| `iDealMackolicUI` | MVC arayüz. Sayfalar ViewComponent parçalarından kurulur | `https://localhost:XXX` |
## Çalıştırmak
SQL Server’ın ayakta olması gerekir. Bağlantı cümlesi `iDealMackolikAPI/Context/ApiContext.cs` dosyasındaki `OnConfiguring` metodundadır. Kendi sunucu adını oraya yaz.
Veritabanını ilk kez kurmak için API klasöründe:
```bash
dotnet ef database update
```
Sonra iki projeyi ayrı terminallerde başlat:
```bash
dotnet run --project iDealMackolikAPI
dotnet run --project iDealMackolicUI
```
API açılınca Swagger `https://localhost:XXX/swagger` adresindedir. Arayüz `https://localhost:XXX` adresindedir.
API kapalıyken Takımlar, Maçlar, Puan Durumu ve maç detayı sayfaları view’a gelmeden hata verir. Bu sayfaların controller’ları önce API’ye istek atar.
## Arayüz sayfaları
| Adres | Dosya | Ne gösterir |
|---|---|---|
| `/` | `Views/Home/Index.cshtml` | Karşılama |
| `/AdminTeam/Index` | `Views/AdminTeam/Index.cshtml` | Takım yönetimi. Admin kabuğunun içinde |
| `/Match/MatchList` | `Views/Match/MatchList.cshtml` | Haftalık fikstür |
| `/League/Index` | `Views/League/Index.cshtml` | Puan durumu |
| `/Match/matchDetail/{id}` | `Views/Match/matchDetail.cshtml` | Maç detayı |
Sol menü `Views/Shared/Components/_NavBar/Default.cshtml` dosyasındadır. Kullanıcılar ve Çıkış Yap satırları `href="#"` olduğu için bir sayfaya gitmez. Bu iki sayfa henüz yok.
## Sayfalar nasıl bölünür
Bir ekran parçası iki dosyadır.
1. C# sınıfı `ViewComponents` klasöründedir. Adı `ViewComponent` ile biter. İçinde `Invoke()` vardır ve `return View();` der.
2. HTML `Views/Shared/Components/{çağrı adı}/Default.cshtml` dosyasındadır. En üstte `Layout = null;` yazar.
Çağrı adı, sınıf adından `ViewComponent` kelimesi silinmiş halidir. `_AdminTopbarViewComponent` sınıfı sayfada şöyle çağrılır:
```cshtml
@await Component.InvokeAsync("_AdminTopbar")
```
`ViewComponents` altındaki `AdminLayout`, `Fixtures`, `Standings`, `MatchDetail` ve `AdminTeam-Index` klasörleri dosyaları konu konu ayırmak içindir. ASP.NET HTML’i bu klasör adına göre aramaz. HTML yolu her zaman `Views/Shared/Components` altındadır.
Admin sayfaları ortak kabuğu kullanır: `Views/Shared/_AdminLayout.cshtml`. Kabuk head, ikon, menü, üst çubuk ve menü script’ini çağırır. Ortaya `@RenderBody()` ile o sayfanın kendi parçalarını koyar. Takım sayfası bu kabuğun içindedir.
Fikstür, puan durumu ve maç detayı kabuğu kullanmaz. Sayfa dosyalarında `Layout = null;` vardır. Kendi `<head>` etiketlerini bir ViewComponent basar.
Stil ve script dosyaları `wwwroot/css` ve `wwwroot/js` içindedir. Şablonların ham halleri `iDealMackolicUI/wwwroot/Sablonlarim` klasöründedir.
## API
| Metot | Adres |
|---|---|
| GET, POST | `/api/Team` |
| GET, POST | `/api/Match` |
| GET | `/api/Match/{id}` |
| GET | `/api/MatchEvent/{id}` |
| GET | `/api/League` |
Tablolar: `Team`, `Match`, `MatchEvent`, `MatchStatistic`, `LeagueTable`. İlişkiler `ApiContext.OnModelCreating` içindedir. Bir maçın ev sahibi ve deplasman takımı silinirken kısıtlıdır; takım silinince maçlar zincirleme silinmez.
