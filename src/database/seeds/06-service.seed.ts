import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import * as bars from "@app/service/data/bars.json";
import * as cafe from "@app/service/data/cafe.json";
import * as restaurants from "@app/service/data/restaurants.json";
import * as beach from "@app/service/data/beach.json";
import * as center from "@app/service/data/center.json";
import * as market from "@app/service/data/market.json";
import * as souvenir from "@app/service/data/souvenir.json";
import * as resort from "@app/service/data/resorts.json";
import * as hotels from "@app/service/data/hotels.json";
import * as homestays from "@app/service/data/homestays.json";
import { Service } from "@app/service/index.entity";
import { Location } from "@app/location/index.entity";
import { ServiceImage } from "@app/serviceimage/index.entity";
import { Category } from "@app/category/index.entity";
import { Amenity } from "@app/amenity/index.entity";
import slugify from "slugify";
import { PhoneNumberUtil } from "@core/utils/phone";

export default class CreateServices implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const allBars = Object.values(bars);
    const allCafes = Object.values(cafe);
    const allRestaurants = Object.values(restaurants);
    const allBeaches = Object.values(beach);
    const allCenters = Object.values(center);
    const allMarkets = Object.values(market);
    const allSouvenirs = Object.values(souvenir);
    const allResorts = Object.values(resort);
    const allHotels = Object.values(hotels);
    const allHomestays = Object.values(homestays);
    await this.addService(connection, allBars, "Quán bar");
    await this.addService(connection, allCafes, "Quán cafe");
    await this.addService(connection, allRestaurants, "Nhà hàng ăn uống");
    await this.addService(connection, allBeaches, "Bãi biển");
    await this.addService(connection, allCenters, "Trung tâm mua sắm");
    await this.addService(connection, allMarkets, "Chợ mua sắm");
    await this.addService(connection, allSouvenirs, "Cửa hàng lưu niệm");
    await this.addService(connection, allResorts, "Khu nghỉ dưỡng");
    await this.addService(connection, allHotels, "Khách sạn");
    await this.addService(connection, allHomestays, "Homestays");
  }

  private async addService(
    connection: Connection,
    allServices: Array<any>,
    type: string,
  ) {
    const servicesToAdd = [];
    for (let i = 0; i < allServices.length; i++) {
      const service: any = allServices[i];
      // Location
      const location = await this.fetchLocation(connection, service.locations);
      if (!location) {
        console.log(
          `Warning: Cannot find location in service ${service.title}`,
        );
      }

      // Category
      const category = await this.fetchCategory(connection, type);
      // Price
      const price = service?.price;

      // Amenities
      const amenities = await this.fetchAmenities(
        connection,
        service.amenities,
      );

      const images = await this.addServiceImages(connection, service.images);
      const slug = slugify(`${service.title} ${Date.now()}`, {
        replacement: "-",
        lower: true,
        trim: true,
      });
      // Create new service object
      const serviceObj = connection.createEntityManager().create(Service);
      serviceObj.title = service.title || "";
      serviceObj.location = location;
      serviceObj.fullAddress = service.fullAddress || "";
      serviceObj.phoneNumber = PhoneNumberUtil.format(
        service.phoneNumber || "",
      );
      serviceObj.description = this.fetchServiceDescription(type);
      serviceObj.category = category;
      serviceObj.price = price;
      serviceObj.slug = slug;
      serviceObj.serviceImages = images;
      serviceObj.originUrl = service.url || "";
      serviceObj.thumbnail = service.thumbnail || "";
      serviceObj.amenities = amenities;
      servicesToAdd.push(serviceObj);
    }

    await connection.createEntityManager().save(Service, servicesToAdd);
  }
  private async fetchLocation(connection: Connection, locationNames: string[]) {
    const allLocations = await connection
      .createQueryBuilder<Location>(Location, "location")
      .where("location.name IN (:...names)", { names: locationNames })
      .getMany();
    return allLocations.length > 1 ? allLocations[1] : allLocations[0];
  }

  private async fetchCategory(
    connection: Connection,
    categoryName: string,
  ): Promise<Category> {
    return connection
      .createQueryBuilder<Category>(Category, "category")
      .where("category.title = :title", { title: categoryName })
      .getOne();
  }
  private async addServiceImages(
    connection: Connection,
    images: Array<any>,
  ): Promise<ServiceImage[]> {
    const imageObjArr = [];
    for (let i = 0; i < images.length; i++) {
      const imageObj = connection.createEntityManager().create(ServiceImage);
      imageObj.fallbackUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
      imageObj.url = images[i];
      imageObjArr.push(imageObj);
    }
    return imageObjArr;
  }

  private async fetchAmenities(connection: Connection, amenities: string[]) {
    let allAmenitiesObjects = [];
    if (amenities && amenities.length > 0) {
      allAmenitiesObjects = await connection
        .createQueryBuilder<Amenity>(Amenity, "amenity")
        .where("amenity.title IN (:...names)", { names: amenities })
        .getMany();
    }
    return allAmenitiesObjects;
  }

  private fetchServiceDescription(type: string) {
    const randomInt = Math.floor(Math.random() * 10);
    switch (type) {
      case "Quán bar":
        return [
          "Quầy bar hay quán bar là một cái bàn hẹp dài hoặc ghế dài được thiết kế để pha chế bia hoặc đồ uống có cồn khác. Ban đầu bàn cao ngang ngực, và một phần thanh thường bằng đồng, chạy theo chiều dài của bàn, ngay trên chiều cao sàn, để khách hàng đặt chân lên, đặt tên cho cái bàn. Trong nhiều năm, chiều cao của các thanh được hạ xuống, và phân cao được thêm vào và thanh bằng đồng thau vẫn còn cho đến ngày nay.",
          "Tên gọi bar trở nên đồng nhất với công việc kinh doanh, (còn được gọi là một saloon hay một tửu quán hoặc đôi khi là một pub hay club, đề cập đến cơ sở thực tế, như trong pub bar hoặc club bar v.v.) là một cơ sở kinh doanh bán lẻ phục vụ đồ uống có cồn, như bia, rượu vang, rượu mùi, cocktail cùng các loại đồ uống khác như nước khoáng và nước ngọt. Các quán bar cũng thường bán các loại đồ ăn nhẹ như khoai tây lát mỏng (còn gọi là khoai tây chiên) hoặc đậu phộng, để phục vụ các khách hàng có nhu cầu.",
          "Đã có nhiều tên khác nhau cho các không gian uống rượu công cộng trong suốt lịch sử. Trong thời kỳ thuộc địa của Hoa Kỳ, các tửu quán là một nơi gặp gỡ quan trọng, vì hầu hết các tổ chức khác đều yếu. Trong thế kỷ 19, các saloon có vai trò quan trọng đối với thời gian giải trí của tầng lớp lao động. Ngày nay, ngay cả khi một cơ sở sử dụng tên khác, chẳng hạn như tavern (tửu quán) hay saloon hoặc, ở Vương quốc Anh, một pub, khu vực nơi người pha chế rót hoặc pha chế đồ uống trong cơ sở thường được gọi là quầy bar.",
          "Bar là một cơ sở kinh doanh phục vụ các loại đồ uống có cồn, bao gồm: bia, rượu vang, rượu, cocktail và các đồ uống khác như nước khoáng, nước giải khát. Bên cạnh đó, ở đó còn phục vụ thêm các món thức ăn nhanh như khoai tây chiên, snack. Tùy theo chính sách ở mỗi địa phương, quốc gia thì khách đến các bar thường ở độ tuổi được phép uống rượu trở lên.",
          "Bar có thể hiểu đơn giản là một thuật ngữ chuyên môn nhằm nhắc đến những nơi phục vụ đồ uống. Chính vì thế, bar là gì có thể hiểu là một nơ chuyên bán những thức uống có cồn dành cho khách hàng như: bia, cocktail cũng như các loại đồ uống khác. Trong đó khách hàng có thể vào bar chủ yếu là những khách hàng trên 21 tuổi.",
          "Đây là một quán rượu và những người khách lui tới thường sẽ sống gần với khu vực quán bar mở. Những quán bar này thường sẽ tiếp những khách hàng có mục đích tới thưởng thức rượu cùng với một vài câu trò chuyện thường ngày. Bên cạnh đó, các quán bar bình dân hiện nay cũng có những trò chơi mới mẻ để giúp cho khách hàng có thể giải trí thêm.",
          "Những khách hàng có điều kiện tài chính ở mức độ khá. Bên cạnh việc phục vụ những món đồ uống có cồn như rượu, cocktail hoặc đồ ăn nhẹ dành cho khách hàng thì chủ quán còn cần phải đầu tư khá nhiều tiên cho màn hình vô tuyến cỡ lớn. Đặc biệt trong những dịp diễn ra các giải đấu bóng đá, giải đấu thể thao lớn thì những quán bar thể thao này luôn rất đông khách hàng tới thưởng thức đồ uống.",
          "Loại hình quán bar còn khá mới mẻ tại Việt Nam. Bar đặc biệt thường chỉ phục vụ chuyên một loại đồ uống nhất định. Một ví dụ cụ thể: nếu như quán phục vụ chuyên về dòng rượu Martini thì món đồ uống đặc trưng của quán bar đó thường sẽ là các món cocktail hoặc đồ uống khác nhau có liên quan đến dòng rượu này.",
          "Hình quán bar giải trí được đặt trên sân thượng của những không gian nghỉ dưỡng cao cấp như: khách sạn, nhà hàng 5 sao…. Vào những dịp đặc biệt, các quán rooftop bar thường là khu vực ăn chơi về đêm của những thiếu gia thường thích những nơi sang trọng, có đẳng cấp và không gian sôi động để phục vụ nhu cầu giải trí của bản thân mình.",
          "Quán bar có thể quan sát trực tiếp cách những nhân viên pha chế (hay còn gọi là các bartender) chế biến các món cocktail và có thể trực tiếp trò chuyện với họ. Bên cạnh việc cung cấp thức ăn nhẹ, đồ uống có cồn; nhiều quán bar còn có thêm các dịch vụ khác như: phi tiêu, các buổi diễn ca nhạc trực tiếp….. để có thể thu hút thêm số lượng khách hàng tới với quán của mình.",
        ][randomInt];
      case "Quán cafe":
        return [
          "Thiên đường của sinh viên và những người làm việc tự do (free-lancer) hoặc tự lao động cho mình. Quán cà phê dạng này cung cấp một không gian tối ưu để làm việc và học tập. Điêm thu hút nhất của loại hình quán này là wi-fi mạnh, bàn ghê cao phù hợp cho việc đọc sách, viết, làm việc, để máy tính, laptop.",
          "Thiết kế và nội thất của quán cà phê dành cho học tập và làm việc dĩ nhiên là phải ưu tiên cho sự yên tĩnh và không ưu tiên cho các đối tượng khách trẻ con, ồn ào. Hơn nữa, khi thiết kế loại quán này, cần tránh những tiếng động cơ của các loại máy như máy xay cà phê, máy pha hay đặc biệt là máy xay đá. Giữ những loại âm thanh này càng xa khách hàng càng tốt.",
          "Nếu bạn muốn biết thêm về quán café loại hình Parisian này, bạn có thể tìm kiếm tại Google về Café Procope, một trong những quán cà phê lâu đời nhất. Hoạt động từ năm 1686, nghĩa là từ thế kỷ thứ 17! Đến này, nơi này vẫn là một quán cà phê rất thành công ngay trung tâm Paris. Những món đồ nội thất tại đây đều phản ánh lịch sử qua từng thời đại. Từ thế kỷ 17 bạn ạ, dường như món đồ nào cũng lão hơn tôi và bạn đấy.",
          "Nhắc đến loại hình quán này tại Việt Nam tôi nghĩ ngay đến Terrace - điển hình của phong cách quán loại này. Ngày nay bạn có thể tìm kiếm những loại hình quán này ở các phố đi bộ của thành phố. Nếu bạn xem những hình ảnh hoặc những bộ phim của nước Pháp, bạn cũng sẽ thấy nhiều loại hình quán này.",
          "Có bán kèm theo thức ăn mang đi, phục vụ luôn một bữa sàng và bữa trưa tiện dụng. Cũng tương đối dễ hiểu, càng nhiều sản phẩm thì khả năng tiếp cận khách hàng của quán càng rộng hơn. Tuy nhiên hãy đảm bảo bạn đủ nguồn lực để các món trên menu đều được chuẩn bị tử tế và ngon miệng.",
          "Nhánh cây thông biểu trưng cho phục sinh, một sức sống mạnh vẽ vượt qua được nhiều khó khăn trắc trở. Một chút kem béo ngậy hoà cùng vị ngọt dịu của chocolate, chút nhẫng đắng của matcha, xua đi những cảm xúc ngột ngạt giữa chốn phố xá ồn ào. Gác chiếc kính xuống để tạm quên nỗi mệt mỏi đời thường…. rồi tận hưởng khoảng không riêng ở quán cà phê chúng mình nhé.",
          "Trà đổ vào Cà Phê hay Cà Phê đổ vào Trà thì cũng ra PhinDi Hồng Trà Mới ngon ngất ngây vậy mà!?? Thưởng thức ngay Chất Phin Quyện Trà trong cực phẩm PhinDi Hồng Trà Mới. Màn kết hợp LẦN ĐẦU TIÊN giữa Cà Phê Phin và Trà đảm bảo sẽ khiến bạn phải 'thổn thức'?",
          "Bí kíp hạnh phúc mùa deadline chồng chất, bật mí ngay tại quán duy nhất ngày Thứ 4. Rủ hội bạn nhâm nhi ly trà sữa thơm ngon trên tay, thổi bay áp lực và đừng quên chương trình Thứ 4 Hạnh Phúc vẫn đang diễn ra hàng tuần bạn nhé!",
          "Những ngọt ngào sưởi ấm đêm đông! Dành cho nhau những buổi tối ấm áp cùng bạn bè với ưu đãi mua 2 đồ uống của mùa Lễ Hội (cỡ Tall) và 1 bánh ngọt với giá chỉ 195,000 Đồng. Đồ uống áp dụng gồm: Jolly Baked Apple Latte và Toffee Nut Crunch Latte, các món bánh ngọt được áp dụng chọn lọc ở mỗi thành phố",
          "Đừng để cái lạnh mùa này đánh lừa rằng bạn cần có người yêu? Điều bạn thật sự cần lúc này là thưởng thức ly Ô Long Thái Cực ấm áp ngọt ngào.",
        ][randomInt];
      case "Nhà hàng ăn uống":
        return [
          "Tình hình dịch phức tạp nhưng cửa hàng vẫn mở cửa, thực hiện đầy đủ việc đeo khẩu trang và sát khuẩn để mọi người yên tâm qua mua sắm . Ngoài ra, bên mình vẫn nhận ship bình thường nên mọi người shopping online cũng được luôn ạ.",
          "BẠN CÓ MUỐN THỬ MỘT CHÚT HƯƠNG VỊ CỦA SỰ SAY MÊ Đón tất niên để nhận vô vàn ưu đãi : Menu đa dạng với trên 45 món tươi ngon phù hợp từ người lớn cho tới trẻ nhỏ",
          "Thưởng thức vị ngon đậm chất trong từng món ăn thơm lừng quyện hòa từ các nhà bếp hàng đầu Việt Nam, lại còn được bonus thêm 1 hương vị bất kỳ trong menu ĐA DẠNG của nhà hàng.",
          "TƯNG BỪNG KHAI TRƯƠNG QUÁN ĂN ONLINE NGON - BỔ - RẺ - Quán ăn ONLINE ship đồ về tận nơi bạn ở, một hình thức tiện lợi cho những tín đồ ăn đam mê ăn uống nhưng lại không muốn đi ra ngoài vì ngại đường xa hoặc không tìm được quán ưng ý.",
          "MENU quán vô cùng phong phú với các món ăn hấp dẫn được chế biến bởi đầu bếp chuyên đồ Hàn. Thực phẩm được chọn lựa cẩn thận, đảm bảo an toàn từ khâu chế biến lẫn đóng gói, để bạn có thể yên tâm thưởng thức ngay khi nhận.",
          "Từ ngày 5/5 đến 29/8, tại BẤT CỨ NGÀY NÀO trong tuần, chỉ cần mua 1 món tại nhà hàng, bạn sẽ được TẶNG ngay 1 nước uống bất kỳ, áp dụng cho TẤT CẢ hình thức đặt hàng.",
          "Sum họp gia đình nay lại càng thêm phần ấm cúng với không gian riêng tư tại nhà hàng của chúng tôi. Chúng mình đã set up 3 tầng riêng biệt với đầy đủ không gian dành cho các bạn Còn chần chừ gì nữa. Hãy đến với chúng tôi ngay nhé!",
          "Hương vị đặc trưng của món là sự hòa quyện giữa nước hầm thịt ngon ngọt và củ cải đỏ đậm đà rất riêng. Các bác có thể ăn súp Borsch kèm với bánh mì đen. Sự kết hợp này làm cho hai món ăn thêm phần hấp dẫn và ngon miệng hơn đấy nhé.",
          "Thời điểm cuối năm là dịp để tiệc tùng chào đón năm mới rực rỡ và thành công. Bạn lo lắng bữa tiệc nhỏ sắp tới mỗi người 1 ý nhưng phải đảm bảo ngân sách đưa ra thì sẽ thật lý tưởng đấy: Thực đơn đa dạng 70-80 món đủ để làm hài lòng từng thành viên trong nhóm. Các món ăn được đảm bảo độ nóng và lên món thường xuyên. Các món ăn được trau chuốt sắc hương mỹ vị bởi các đầu bếp chuyên nghiệp.",
          "Nhân viên phục vụ nhanh nhẹn giúp bàn ăn luôn sạch sẽ để khách hàng thoải mái sử dụng. Chọn tiệc buffet cho cuối năm sẽ thật hợp lý phải không nào? Gọi 1900 234 550 để hẹn ngay bạn nhé!",
        ][randomInt];
      case "Bãi biển":
        return [
          "Biển ở đây xanh ngắt một màu, sạch sẽ nổi bật lên là bãi cát trắng, chạy dài là những hàng dương xanh mát, hai dãy núi bao quanh tạo nên khung cảnh yên bình nên thơ.",
          "Ngoài việc tắm biển, bạn còn được tham gia nhiều hoạt động thú vị khác như: Khám phá nơi nuôi dưỡng trai lấy ngọc nổi tiếng, đi dạo tại chợ đêm và tham quan nhiều điểm du lịch nổi tiếng.",
          "Biển xanh - Cát trắng - Nắng vàng là những điều tuyệt vời, miêu tả chính xác về bãi biển và cũng chính điều này đã chinh phục được bất cứ ai khi đến đây và nhanh chóng trở thành một trong những bãi biển đẹp nhất Việt Nam được yêu thích nhất",
          "Là linh hồn của thành phố, đóng vai trò quan trọng trong cuộc sống thường ngày của người dân nơi đây. Buổi sáng thì dạo biển, ngắm bình minh hoặc đột kích chợ hải sản, chiều tắm biển mát rượi, lướt ván, chèo thuyền, nhảy dù hoặc chơi bóng chuyền, tối đến cắm trại bờ biển hay đi dạo dưới bầu trời ngàn sao, biển sẽ vỗ về và nâng niu mọi cảm xúc của bạn",
          "Bạn không chỉ được hòa mình vào dòng nước biển trong xanh, mà còn có cơ hội khám phá rất nhiều các danh lam, thắng cảnh nổi tiếng. Cùng với đó bạn sẽ được ghé thăm và tìm hiểu các làng nghề truyền thống.. Tất cả những điều này đều đem tới các trải nghiệm vô cùng thú vị cho khách du lịch.",
          "Với vẻ đẹp thiên nhiên làm say đắm lòng người, cùng dòng nước biển mát lạnh, đây là một trong những bãi biển thu hút đông đảo lượng khách du lịch nước ngoài đến tham quan với dải cát trắng miên man trãi dài như vô tận, nước biển trong xanh một màu ngăn ngắt.",
          "Các bạn có thể thỏa thích bơi lội trong dòng nước biển mát lạnh, và tham gia những hoạt động trên biển như đạp xe dạo quanh biển, lặn biển ngắm nhìn sinh vật biển dưới làn nước, chèo thuyền, bóng chuyền, câu cá trên biển cũng rất tuyệt vời.",
          "Là một vùng hoang sơ mới được khai thác với nước biển trong xanh, khu bãi tắm rộng, độ dốc thoai thoải và đặc biệt đẹp thơ mộng nhờ các tảng đá nằm ngay trong bãi tắm tạo nên những đợt sóng biển tung bọt trắng xóa.",
          "Tắm biển ở đây mang đến cho du khách một cảm giác thú vị giống như lạc vào giữa thiên nhiên, thả mình trong làn nước xanh thẳm để thưởng thức những gì còn hoang sơ của núi rừng và biển cả.",
          "Cảnh quan thiên nhiên hoang sơ, bí ẩn, đẹp kỳ diệu với những du khách ưa thích khám phá. Những bãi cát trắng mịn và nước biển xanh ngắt một màu vươn xa tận chân trời là điều đầu tiên bạn sẽ thấy khi đến với địa điểm này.",
        ][randomInt];
      case "Trung tâm mua sắm":
        return [
          "Trung tâm thương mại là nơi vừa vui chơi giải trí, lại vừa có thể mua sắm tất tần tật những món đồ cần thiết, từ gia dụng, điện máy, thời trang,… Chính vì vậy, đây là địa điểm được nhiều người ưa chuộng và hay ghé đến mỗi lúc rảnh rỗi.",
          "Đây là thương hiệu có kinh nghiệm lên đến 180 năm trong việc mang đến cho khách hàng những sự tiện ích trong những trung tâm thương mại nổi tiếng cao cấp.",
          "một trong các trung tâm thương mại lớn, đạt chuẩn Quốc tế đầu tiên tại Việt Nam. Trung tâm thương mại quận 7 này được thành lập từ 2011 và vẫn được đông đảo khách hàng yêu thích và ưa chuộng cho đến ngày nay",
          "Với tòa nhà to lớn và đồ sộ, trung tâm còn gây ấn tượng mạnh với khách hàng bởi khắp nơi đều là góc check-in vô cùng đẹp, tạo nên những bức ảnh ấn tượng và thu hút. Có lẽ vì thế mà nơi này thu hút hơn 250.000 ngàn khách tham quan và mua sắm mỗi tháng.",
          "Đến với siêu thị, bạn có thể tìm thấy vô số thương hiệu quen thuộc như King BBQ, Kichi Kichi, Dreamer Land, CGV Imax, cùng với đó là hàng chục cửa hàng thời trang, điện máy, đồ gia dụng lớn nhỏ,… tất cả đã khiến nơi đây trở thành địa điểm yêu thích của khách hàng.",
          "Tất tần tật các hoạt động mua sắm, vui chơi, thẩm mỹ vừa kể trên của Diamond Lê Duẩn đều được cung cấp bởi nhiều thương hiệu lớn, uy tín và chất lượng. Chính vì thế, khách hàng có thể hoàn toàn hài lòng và yên tâm khi ghé đến trung tâm thương mại sầm uất này.",
          "Với tiêu chí 'tất cả là một', siêu thị mang đến cho khách hàng hơn 800 gian hàng ở mọi lĩnh vực như thời trang, mỹ phẩm, đồ điện tử, hàng tiêu dùng,… cùng với đó là khu tích hợp vui chơi giải trí, rạp chiếu phim, khu ẩm thực,… tất tần tật đều làm hài lòng mọi vị khách.",
          "Nhằm mang đến sự hài lòng tối đa trong trải nghiệm của khách hàng, siêu thị mang đến mô hình “one stop shop” - một nơi đến, đa dịch vụ. Có lẽ vì thế mà trung tâm thương mại này trở thành điểm đến lý tưởng của người dân trong khu vực mỗi khi vào cuối tuần, dịp lễ…",
          "Trung tâm thương mại trên cũng mang đến cho khách hàng vô vàn sự lựa chọn từ mua sắm, làm đẹp, vui chơi giải trí, ẩm thực,… tất tần tật đều khiến khách hàng có thể thỏa sức tận hưởng khoảng thời gian tham quan đầy thú vị.",
          "Đến với trung tâm mua sắm, bạn sẽ có cảm giác như mình đang lạc vào một địa điểm cực kỳ sầm uất tại các cường quốc, bởi nơi này được tích hợp hơn 200 thương hiệu nổi tiếng ở mọi lĩnh vực như thời trang, ẩm thực, giải trí kết hợp cùng công nghệ hiện đại,…",
          "Trung tâm mang đến cho khách hàng nhiều điều thú vị từ mua sắm cho đến ăn uống và vui chơi giải trí,… Nơi đây được tích hợp hơn 120 gian hàng, có thể chia thành nhiều khu vực lớn để đáp ứng nhu cầu của mọi khách hàng dù là người khó tính nhất.",
        ][randomInt];
      case "Chợ mua sắm":
        return [
          "Chợ luôn hoạt động sầm uất chủ yếu từ khuya đến sáng, buôn bán hàng nghìn tấn nông, thuỷ, hải sản mỗi ngày. Cảnh buôn bán tấp nập không chỉ diễn ra bên trong mà còn ở bên ngoài nhà lồng chợ. Tuy nhiên, các hàng bên ngoài chợ chủ yếu phục vụ cho khách mua lẻ, với giá cả nhỉnh hơn đôi chút.",
          "Chợ bán buôn từ 21 giờ đến 4 giờ sáng thu hút hàng hóa nông sản thực phẩm của các tỉnh miền Tây và miền Đông Nam bộ, là nơi cung cấp hàng nông sản thực phẩm cho người dân thành phố…nhiều loại rau củ, hoa quả, mặt hàng nông sản phục vụ cho người dân, nhà hàng, quán ăn trên địa bàn thành phố.",
          "Ngay từ cửa vào tầng trệt là những hàng bán quần áo, kính râm, giày dép, vali cho đến đồ điện tử như điện thoại, cáp xạc, pin sạc, đèn pin siêu sáng, loa, đài radio…nhưng chủ yếu là những mặt hàng xuất xứ từ Trung Quốc. Khu vực tầng 2 bán buôn bán lẻ quần áo cho người lớn và các loại vải vóc, gấm, lụa, đồ dành cho trẻ sơ sinh…, phía sau chợ có các hàng bán chim thú cảnh.",
          "Vào nửa đêm tầm 23h tới 6h sáng hôm sau, với các loại rau củ nườm nượp được chở tới đây bằng các phương tiện ôtô, xe máy, xe thồ, xe máy kéo cải tiến… Ước tính có tới 200 tấn rau củ được tiêu thụ mỗi đêm.",
          "Nhiều loại hải sản mà ngư dân miền Trung đánh bắt được đưa về đây phong phú với đủ loại như cá nục, cá ngừ, cá chuồn, cá mú, cá kè đến mực ống, mực lá, bạch tuộc, tôm, ghẹ… Ở cảng cá này, nhiều khách du lịch hay người dân địa phương muốn mua lẻ với số lượng khoảng vài kg cũng được chủ tàu bán với giá rất rẻ. Giá hải sản ở đây thường rẻ hơn rất nhiều so với giá bán lẻ ở chợ, có loại rẻ bằng phân nửa so với giá bán lẻ.",
          "Chợ gồm nhiều mặt hàng đã được phân loại cho đồng đều về chất lượng, kích cỡ. Nếu như dân địa phương và các vùng lân cận thường sử dụng các ghe, xuồng trung bình chở các mặt hàng nông sản đến đây tiêu thụ thì những ghe bầu lớn là của các thương lái thu mua trái cây tỏa đi khắp nơi, sang tận Campuchia và Trung Quốc.",
          "Chợ có lượng hàng hóa đa dạng và rất phong phú, nhất là trái cây, hàng nông sản, ngoài ra còn có chiếu, hang thủ công mỹ nghệ, đồ gia dụng cho đến hàng gia cầm, thủy hải sản… cho tới cả đồ ăn, thức uống cũng không thiếu. Nơi đây không chỉ nơi buôn bán hàng hóa mà còn là địa điểm thu hút khách du lịch.",
          "Tất cả các loại nông sản của tỉnh Lâm Đồng sau khi thu hoạch được vận chuyển về chợ đầu mối này rồi tỏa đi đến nhiều siêu thị và chợ đầu mối khác thuộc các tỉnh thành miền Trung, Tây Nguyên và một số tỉnh phía Nam để tiêu thụ.",
          "Chợ thường họp từ 22h đến sáng hôm sau không kể mưa nắng. Tuy nhiên, thời điểm nhộn nhịp nhất từ 0h đến 2h sáng, xe tải lớn nhỏ chở các mặt hàng hoa quả từ các vườn quả ở tỉnh lân cận hoặc từ miền Trung, miền Nam, từ các cửa khẩu tiến vào chợ tạo ra khung cảnh mua bán vô cùng sôi động.",
          "Chợ là nơi lưu thông hàng hóa, nơi cung cấp hàng hóa thiết yếu như lương thực, thực phẩm, hàng hóa tiêu dùng khác, đáp ứng nhu cầu của nhân dân, đồng thời tạo công ăn việc làm, gia tăng cơ hội sinh kế cho người dân và tạo nguồn thu cho ngân sách. Sự phát triển của chợ cũng được coi là yếu tố phản ánh tốc độ phát triển kinh tế xã hội của địa phương.",
        ][randomInt];
      case "Cửa hàng lưu niệm":
        return [
          "Nơi quy tụ đội ngũ nhân viên tương đối chuyên nghiệp, nhiệt tình, chu đáo luôn sẵn sàng giúp các 'thượng đế' tìm và mua sắm được sản phẩm ưng ý nhất.Khách hàng đánh giá cao sản phẩm của shop chính ở tính ứng dụng, bạn có thể trang trí ở nhà, sách vở đi học hay dùng làm quà tặng đáng yêu nhân dịp sinh nhật bạn bè hoặc người thân.",
          "Địa điểm shopping không thể tuyệt vời hơn dành cho hội khách hàng đương muốn tìm những mẫu phụ kiện quà tặng đẹp và chất nhất hiện nay. Ba tiêu chí: 'đẹp, độc, điệu' có thể đáp ứng đủ chỉ trong một nốt nhạc!",
          "Không đơn thuần chỉ là một shop đồ lưu niệm hay shop quà tặng thông thường mà đã trở thành một thương hiệu hàng đầu cung cấp quà tặng lưu niệm mang tính nghệ thuật cao, chất lượng, đẳng cấp. Đây là nơi không chỉ mang đến cho khách hàng những món quà đẹp nhất, sang trọng nhất mà còn lên kế hoạch sự kiện và những giải pháp hoa và quà tặng cá nhân hóa toàn diện nhất cho cộng đồng.",
          "Với đội ngũ nhân viên nhiệt tình tư vấn và hỗ trợ tích cực cho khách hàng. Mong tạo sự thoải mái và hài lòng về phong cách phục vụ đến với khách hàng nhằm giúp khách hàng có thể mua được những sản phẩm mà khách hàng yêu thích.",
          "Mỗi món đồ lưu niệm ở shop đều có những câu chuyện rất hay, bạn không thể nào bỏ qua được những sản phẩm quà lưu niệm, quà tặng trao cho mọi người ở shop vì mỗi món quà không những xinh xắn mà còn có ý nghĩa vô cùng lớn lao.",
          "Shop đồ lưu niệm thiết kế độc đáo và chất lượng nhất dành cho những bạn đam mê các sản phẩm trang trí, lưu niệm thiết kế. Shop chưa bao giờ làm khách hàng phải thất vọng với những sản phẩm chất lượng của mình.",
          "Đến với cửa hàng, bạn như bị lạc vào thế giới bạn như được bước vào thế giới của những món đồ décor độc đáo, với phong cách nhẹ nhàng. Chắc chắn, bạn sẽ chọn được vô số những món quà lưu niệm dành tặng người thân, bạn bè của mình mà khó có thể làm họ thất vọng.",
          "Bạn có muốn một món quà lưu niệm dành tặng cho bạn bè không? Hãy đến với cửa hàng của chúng tôi - nơi của những sản phẩm quà tặng thiết kế. Đa số các sản phẩm quà tặng tại shop đều là thú nhồi bông, móc khóa nhưng đều là những sản phẩm được lựa chọn nguyên liệu kĩ càng, thiết kế tỉ mỉ và tất cả đều là các sản phẩm sản xuất theo mùa, có giới hạn",
          "Mỗi sản phẩm, shop mong muốn gởi đến mọi người những sản phẩm độc đáo, tinh tế, sáng tạo, chất lượng nhất từ bàn tay của con người. Bạn sẽ hoàn toàn thư giãn với giai điệu ngọt ngào lãng mạn từ những chiếc hộp nhạc với kiểu dáng độc đáo.",
          "Chúng tôi luôn đặt mình vào vị trí khách hàng, để có thể cung cấp các sản phẩm đúng như mong muốn với một dịch vụ tốt nhất có thể. Tại cửa hàng, bạn sẽ được các nhân viên đón tiếp chu đáo bằng một nụ cười thân thiện, họ sẽ kiên nhẫn chờ bạn chọn lựa và tư vấn tỉ mỉ về từng món quà.",
        ][randomInt];
      case "Khu nghỉ dưỡng":
        return [
          "Khu nghỉ dưỡng bao gồm 200 phòng khách sạn đẳng cấp phòng suit, penthouse và biệt thự, mỗi phòng trung bình 70m2 được thiết kế với hướng nhìn ra biển. Ngoài ra, resort này còn cung cấp các villa riêng biệt, Villa hướng biển với 2-3 phòng ngủ.",
          "Một địa điểm cực kì thú vị đối những du khách thích sự yên bình và không khí thoáng đãng. Resort gồm 229 phòng thiết kế theo dạng căn hộ, nội thất là sự hòa quyện tinh tế giữa văn hóa Việt Nam truyền thống và hiện đại. Đây là dự án căn hộ cao cấp ba tầng sát biển đầu tiên và độc nhất tại Việt Nam. Tại đây du khách có thể khám phá những tác phẩm tuyệt đẹp từ tranh thêu lụa đến tranh sơn mài làm bằng vỏ trứng.",
          "Resort hiện đại với nội thất đầy phong cách. Các chỗ nghỉ lắp máy điều hòa tại đây được cung cấp Wi-Fi miễn phí. Resort này có 2 nhà hàng và 1 quầy bar cũng như spa và hồ bơi ngoài trời. Các phòng, suite và loft rộng rãi tại đây được trang bị TV truyền hình vệ tinh màn hình phẳng cùng đầu đĩa DVD. Các phòng tắm riêng có bồn tắm, máy sấy tóc, áo choàng tắm và đồ vệ sinh cá nhân miễn phí. Các suite cũng như loft đi kèm với bếp nhỏ và khu vực sinh hoạt rộng rãi.",
          "Với những tiện ích nội khu đạt chuẩn quốc tế như câu lạc bộ golf, câu lạc bộ du thuyền, thể thao, giải trí, khu chăm sóc sức khỏe, spa, hệ thống nhà hàng sang trọng, bể bơi 4 mùa với tổng diện tích lên đến 1000m2... Khu nghỉ dưỡng sẽ mang đến cho du khách một phong cách nghỉ dưỡng hoàn hảo sau những ngày mệt mỏi với cuộc sống bon chen nhộn nhịp ở thủ đô.",
          "Khu nghỉ dưỡng gồm hai tòa nhà Executive và Deluxe với 485 phòng kiến trúc tuyệt đẹp, trong đó có 17 phòng sang trọng và 2 phòng Tổng thống Suites.Tất cả các phòng ở đây đều có ban công riêng nhìn ra cảnh biển hoặc đồi núi xung quanh. Ngoài ra, mỗi phòng đều được trang bị minibar với máy pha trà và cafe, wifi truy cập miễn phí, truyền hình cáp vệ tinh với trên 50 kênh truyền hình chọn lọc hấp dẫn.",
          "Với 109 phòng được xây dựng theo kiến trúc đa dạng, khu nghỉ dưỡng được du khách yêu thích không chỉ bởi không gian sống và các giá trị kiến trúc độc đáo mà còn bởi các dịch vụ và phương tiện giải trí rất đa dạng.",
          "Khu nghỉ dưỡng này gồm 32 biệt thự 1 phòng ngủ hướng kênh đào và 17 biệt thự một phòng ngủ hướng biển. Tất cả các phòng đều được trang bị dịch vụ tiện ích đầy đủ như TV màn hình phẳng, wifi 24h, bồn tắm nước nóng, bể bơi riêng tại 1 số phòng...để du khách có thể thoải mái tận hưởng kì nghỉ một cách tiện nghi nhất. Khu nghỉ dưỡng còn cung cấp rất nhiều phương tiện giải trí như sân golf tại chỗ, thể thao dưới nước, bể bơi ngoài trời, bể sục, phòng thể dục, massage, spa, sân chơi squash để du khách có thể tận hưởng một kì nghỉ dưỡng lý tưởng ở Huế.",
          "Resort có kết cấu gồm 409 phòng, với 3 tòa căn hộ từ 6 đến 12 tầng, các tòa căn hộ được bố trí so le nhau mang lại cảm giác an toàn và ấm cúng cho du khách. Hầu hết các căn biệt thự đều có ban công với tầm nhìn hướng ra biển, mỗi căn biệt thự có 3 phòng ngủ và sở hữu bể bơi riêng biệt. Những tiện ích của khách sạn bao gồm: bể bơi trẻ em, spa, nhà hàng, quán bar, thể thao dưới nước... giúp du khách tận hưởng kì nghỉ một cách thoải mái và tuyệt vời nhất.",
          "Ngoài thư giãn sảng khoái, du khách cũng có thể tận hưởng nhiều hoạt động và du ngoạn trên hoặc dưới nước, tại rạn san hô, trên cạn bằng cách tham gia cuộc phiêu lưu văn hóa hoặc động vật hoang dã, hoặc sử dụng các tiện nghi của khu nghỉ mát và nhiều loại thiết bị thể thao. Khu nghỉ dưỡng cũng là một khung cảnh hoàn hảo cho những lễ cưới đáng nhớ.",
          "Một trong những resort nổi tiếng được nhiều du khách nước ngoài biết đến và lựa chọn làm nơi nghỉ dưỡng cho chuyến đi của mình. Khu nghỉ dưỡng ẩn mình tại một không gian xanh trải dài của những ngọn đồi nhấp nhô giữa rừng thông, xen kẽ những khu vườn xinh xắn tạo nên không gian yên tĩnh và lãng mạn.",
        ][randomInt];
      case "Khách sạn":
        return [
          "Tới khách sạn, du khách không chỉ liên tưởng tới khu khách sạn 5 sao đẳng cấp quốc tế với 483 phòng nghỉ và 173 biệt thự có kiến trúc tuyệt đẹp, tuyến cáp treo vượt biển dài nhất thế giới, bãi tắm tự nhiên đẹp nhất Nha Trang, hay hệ thống bể bơi khách sạn ngoài trời rộng nhất Đông Nam Á… mà còn liên tưởng đến những khu di tích và danh thắng nổi tiếng, những dịch vụ chăm sóc sức khỏe, sắc đẹp sang trọng, hiện đại cùng chuỗi nhà hàng tiện nghi và đẳng cấp. Đây cũng là cũng là một khung cảnh hoàn hảo cho những lễ cưới đáng nhớ.",
          "Khách sạn tiêu chuẩn 5 sao mới độc đáo, đây cũng là khu nghỉ dưỡng spa toàn diện và sang trọng. Khách sạn được thiết kế mang đặc trưng phong cách Á Châu. Điều hấp dẫn nhất là các dịch vụ thư giãn, trị liệu spa ở đây quý khách có thể tha hồ tận hưởng. Khu du lịch bãi biển có 80 biệt thự rộng rãi, thiết kế theo có hồ bơi, 4 biệt thự spa (2 phòng ngủ), 3 phòng biệt thự hướng biển (2/3 phòng ngủ) mang đến không gian thoải mái.",
          "Trải qua nhiều lần trùng tu và sửa chữa, khách sạn vẫn mang trong mình phong cách kiến trúc cổ kính và thanh lịch nhưng không kém phần hoa lệ, hiện đại. Du khách bước chân vào sảnh chính khách sạn như bước vào một không gian lộng lẫy, sang trọng. Mọi chi tiết tại đây dường như nổi bật hơn, từ những bức tranh được bố trí trên bức tường sảnh chính cho đến khu quầy lễ tân được làm từ gỗ cao cấp.",
          "Khách sạn có tất cả 230 phòng và các phòng sang trọng tại khách sạn mang đặc trưng với nét trang trí kiểu Pháp cổ điển, có giường và đồ nội thất cao cấp. Mỗi phòng máy lạnh đều nhìn ra cảnh thành phố hoặc hồ bơi và được trang bị TV truyền hình cáp, minibar cùng máy pha trà/cà phê. Khách sạn sẽ trở thành khách sạn năm sao vào cuối năm 2011 với 233 phòng, kết hợp giữa phong cách hiện đại và cổ điển, các nhà hàng Âu và Á, phòng hội nghị chuyên nghiệp với sức chứa lên đến 500 người, cùng với dịch vụ thư giãn giải trí đa dạng sẵn sàng đáp ứng mọi nhu cầu của quý khách hàng.",
          "Điểm nhấn đặc biệt của các biệt thự tại đây chính là tính sang trọng, chất lượng hoàn hảo và sự riêng tư. Trở thành chủ sở hữu biệt thự lâu dài hay nghỉ dưỡng tại đây, Quý khách đều có cơ hội tận hưởng và trải nghiệm một phong cách sống đẳng cấp, tiện nghi trong không gian thanh bình, lãng mạn, hài hòa với thiên nhiên. Hãy liên hệ với chúng tôi để có cơ hội sở hữu những biệt thự đặc biệt sang trọng.",
          "Khách sạn được biết đến không chỉ vì những món ăn ngon mà còn bởi những trang thiết bị tiện nghi, trang nhã, sang trọng và sự phục vụ nhiệt tình, chuyên nghiệp của đội ngũ nhân viên. Đặc biệt, đây là một trong những khách sạn chú trọng đến khung cảnh mặt tiền đẹp và sang trọng bởi hệ thống các cửa hàng cao cấp, với những nhãn hiệu nổi tiếng nhất toàn thế giới: Hermes, Louis Vuiton, Cartier, Ferregamo, Jaeger Le Coultre... thoả mãn nhu cầu của những khách hàng chuộng hàng hiệu. Sofitel Metropole liên tục được chọn là một trong những khách sạn hàng đầu tại Hà Nội, trên toàn lãnh thổ Việt Nam và Châu Á, từng gắn liền với tên tuổi của rất nhiều nhân vật nổi tiếng và các nhà chính khách quốc tế đã từng nghỉ tại đây.",
          "Đây là một khách sạn hạng sang nổi tiếng ở thành phố Hồ Chí Minh, gần Nhà thờ chính tòa Đức Bà Sài Gòn và Nhà hát Lớn thành phố. Năm 2003, khách sạn Rex đã trải qua một đợt mở rộng và chỉnh trang về kiến trúc, nội thất và kỹ thuật.",
          "Các phòng nghỉ tại khách sạn mở ra ban công với tầm nhìn ra quang cảnh thành phố, hồ nước hoặc hồ bơi và có lò sưởi. Ngoài ra còn đi kèm TV màn hình phẳng và phòng tắm riêng với bồn tắm và vòi sen riêng biệt. Du khách có thể rèn luyện sức khỏe ở trung tâm thể dục của khách sạn và thư giãn tại spa sau đó. Chỗ nghỉ này cũng có tiện nghi phòng xông hơi khô và phòng xông hơi ướt. Dịch vụ đưa đón sân bay 2 chiều được cung cấp theo yêu cầu với một khoản phụ phí. Du khách được bố trí chỗ đỗ xe riêng miễn phí.",
          "Các phòng nghỉ rộng rãi tại đây được trang bị két an toàn cá nhân, tiện nghi pha trà/cà phê và truyền hình cáp màn hình phẳng. Ngoài ra còn có lối trang trí nội thất kết hợp giữa phong cách thời Pháp thuộc và truyền thống Việt Nam, phòng tắm lớn lát đá cẩm thạch cùng không gian làm việc rộng rãi. Khách sạn có trung tâm thể dục 24 giờ với các thiết bị luyện tập, phòng xông hơi khô và bồn tắm spa. Nhà hàng phục vụ ẩm thực quốc tế tự chọn và các món đặc sản biển. Khách có thể thưởng thức các đặc sản thịt nướng và hải sản tại nhà hàng, nơi cũng phục vụ các loại rượu. Chime Bar cung cấp một không gian sống động cho bữa tối thân mật.",
          "Ngập tràn ánh sáng tự nhiên thông qua các ô cửa sổ thoáng mát, các phòng nghỉ đầy đủ tiện nghi với tông màu trung tính, nhẹ nhàng được lắp máy điều hòa và có đồ nội thất cổ điển cùng TV màn hình phẳng để du khách tận hưởng. Một số phòng còn có khu vực ghế ngồi. Ấm đun nước, dép đi trong phòng và máy sấy tóc cũng được cung cấp để tạo thuận tiện cho du khách. Các phòng tắm riêng được trang bị bồn tắm, áo choàng tắm cũng như đồ vệ sinh cá nhân miễn phí.",
        ][randomInt];
      case "Homestays":
        return [
          "Với sức chứa 4-5 người gồm 2 phòng ngủ, 2 giường, 1 phòng tắm bạn và nhóm cạ cứng có thể tha hồ tận hưởng không gian riêng một cách thoải mái nhất. Điểm nổi bật của homestay này là decor rất xinh yêu với gam màu tươi sáng bắt mắt. Mọi góc nhỏ trong căn homestay đều có thể thỏa mãn nhu cầu sống ảo của bạn! Nếu bạn muốn trổ tài nấu nướng, hãy nhớ là căn bếp đầy đủ tiện nghi đã được chuẩn bị sẵn sàng rồi.",
          "Bạn sẽ tìm được riêng cho mình những giấc mơ thật đẹp. Căn hộ ấm cúng, yên bình này có phòng ngủ sáng sủa và thoáng mát mở ra ban công lớn với tầm nhìn toàn cảnh núi non, thung lũng tuyệt đẹp. Một không gian được thiết kế hiện đại và tươi mới với một chút quyến rũ mộc mạc. Còn gì tuyệt vời hơn là được thức giấc đón ánh nắng bình minh đẫm mình trong sương sớm, thưởng thức không khí trong lành của núi đồi bên tách cà phê thơm ngào ngạt.",
          "Với view thung lũng và núi đồi tuyệt đẹp, đến đây bạn sẽ được thả hồn vào với cây cối, hoa cỏ và mây mù. Cả một thế giới xinh đẹp ngoài kia chỉ cách bạn bởi một vách kính, bạn có thể tưởng tượng ra bản thân thật nhỏ bé và đang hòa quyện với bức tranh thiên nhiên để chính bản mình trở thành một thành phần trong bức tranh đó.",
          "Với ý nghĩa căn nhà mộc mạc, thế nhưng homestay này không hề đơn điệu một chút nào. Thú vị ở chỗ, đến với Rustic House, du khách có tới 4 sự lựa chọn căn phòng với 4 kiểu decor khác biệt. Giá tiền phải chăng nhất là căn phòng Black & White. Đúng như tên gọi, cả căn phòng bé xinh đều chỉ có 2 màu chủ đạo là đen và trắng. Những mảng màu trắng đen xen lẫn rất tinh tế, mang đến hơi thở sang trọng hiện đại của người trẻ. Những vật dụng bé xinh trong phòng được thiết kế tỉ mỉ, trên bức tường trắng tinh là những bức tranh nghệ thuật được đóng khung sang trọng.",
          "Điểm níu chân du khách đến homestay xinh đẹp này chính là ở thiết kế chẳng giống ai. Chỉ vỏn vẹn 4 phòng nhưng chủ nhà lại thiết kế cho mỗi phòng một phong cách khác nhau đặc trưng của nhiều vùng miền đất nước Việt Nam. Đặt chân đến đây, du khách tưởng chừng như lạc vào hành trình của một chuyến đi xuyên Việt vậy.",
          "Không biết vô tình hay cố ý, những góc phòng đều được trang trí những chậu cây chuối cảnh rất độc, góc nhỏ đọc sách, đĩa than nghe nhạc rất nghệ như một studio chuyên nghiệp. Với thiết kế theo từng mảng xinh xắn, đồ nội thất, trang trí chỉ là những vật dụng thường ngày đơn giản nhất, nhưng đều được chọn lựa tỉ mỉ tinh tế. Ngay cả đến chiếc bình hoa bằng gốm, tấm thảm kẻ hay chiếc gương, bộ bàn ghế gỗ nâu xước vân đều mang 'chất nghệ' đến không ngờ. Có lẽ để một thánh sống ảo lạc vào homestay xinh xắn này thì không biết bao tấm ảnh cho vừa!",
          "Là một địa chỉ tĩnh lặng, thích hợp với những bạn muốn tìm sự bình yên, hoà mình với thiên nhiên, cây cỏ, núi rừng, chiêm nghiệm những điều xưa cũ. Đến với INDIgo, bạn sẽ được thảnh thơi đi dạo, thưởng thức những món ngon được lấy từ vườn rau sạch hay có thể đốt lửa quay quần cùng người thân bên bàn tiệc ngoài trời,… Sáng thức dậy ở đây bạn sẽ thấy rừng thông trong nắng sớm, phía xa là những dãy nhà nắng vàng, mang đến cho bạn một cảm giác không thể nào diễn tả được bằng lời được.",
          "Tới đây, bạn sẽ được tận hưởng thiên nhiên, ngắm nhìn vẻ đẹp xanh tươi của cây cỏ, ngắm khoảng trong xanh, ngọt dịu của bầu trời, cảm thấy gió mát vờn quanh mái tóc, hít thở không khí trong lành̀ và để tìm lại chính mình. Đây sẽ là nơi để bạn lắng mình trong không gian nhỏ, mộc mạc, bình yên đến lạ. Một khi đã đến đây bạn sẽ bị níu chân với những thứ bình dị, trong trẻo, với vườn hồng trĩu quả khi vào mùa, với góc sân đầy hoa và cỏ.",
          "Được đánh giá là một địa điểm nghỉ ngơi hết sức lý tưởng cho những ai đặt chân đến Nha Trang. Không gian rộng rãi, nằm ở trung tâm nên rất thuận tiện đi lại. Phòng ốc được trang trí với thiết kế hiện đại, đơn giản, phòng được phối màu khá ấn tượng không theo quy luật, trong phòng có đầy đủ tiện nghi như ti vi, tủ đồ,...giúp đem lại cho bạn cảm giác như ở nhà. Ban công sạch sẽ, thoáng mát, có tầm nhìn đẹp ra phố để bạn dễ dàng sống ảo. Sân thượng tại đây rất rộng rãi, mọi người có thể tụ tập và nấu ăn tự do cùng nhau.",
          "Có một cây tri thức nhiều nhánh được làm từ gỗ. Trên đó chứa tất tần tật các loại sách hay. Từ đông tây kim cổ, nhật kí hành trình đến các thể loại văn học nghệ thuật, tiểu thuyết, tản văn… Chốn này thu hút rất nhiều bạn trẻ yêu sách ưa xê dịch. Góc này view cũng đủ đẹp để các bạn có những tấm ảnh so deep làm kỉ niệm đấy.",
        ][randomInt];
      default:
        return "";
    }
  }
}
