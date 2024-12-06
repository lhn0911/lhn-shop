<template>
  <footer class="footer clearfix">
    <div class="middle-footer">
      <div class="container">
        <div class="row">
          <!-- Company Information -->
          <div class="footer-click">
            <div class="foo-contact">
              <h4>Công ty CPĐT Thế Giới Sữa</h4>
              <ul>
                <li>MST : 0106933743</li>
                <li>
                  Do Sở Kế Hoạch và Đầu Tư Thành Phố Hà Nội cấp ngày 12/08/2015
                </li>
                <li>
                  <b>Địa chỉ: </b> Số 17 Ngõ 84 Phố Ngọc Khánh - Phường Giảng Võ
                  - Quận Ba Đình - Hà Nội.
                </li>
                <li>
                  <b>Hotline: </b>
                  <a href="tel:0986777514-1900636605">0986777514-1900636605</a>
                </li>
                <li>
                  <b>Email: </b>
                  <a href="mailto:cskh@thegioisua.com">cskh@thegioisua.com</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Instructions -->
          <div class="footer-click">
            <h4>Hướng dẫn</h4>
            <ul class="toggle-mn">
              <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
              <li><a href="/huong-dan-thanh-toan">Hướng dẫn thanh toán</a></li>
              <li><a href="/huong-dan-nhan-hang">Hướng dẫn nhận hàng</a></li>
            </ul>
            <div class="social-icons">
              <a
                href="https://www.facebook.com/thegioisuaonline/"
                target="_blank"
                class="facebook"
                title="Facebook"
              >
                <IoLogoFacebook />
              </a>
              <a
                href="https://www.youtube.com/channel/UCCR9XcxdusE9Tbe0_2A25HA"
                target="_blank"
                class="youtube"
                title="Youtube"
              >
                <AkYoutubeFill />
              </a>
              <a href="" target="_blank" class="twitter" title="Twitter">
                <AkTwitterFill />
              </a>
              <a
                href="https://www.instagram.com/thegioisuacom"
                target="_blank"
                class="instagram"
                title="Instagram"
              >
                <AkInstagramFill />
              </a>
              <a
                href="//zalo.me/0986777514"
                target="_blank"
                class="zalo"
                title="Zalo"
              >
                <i class="fa fa-zalo"></i>
              </a>
            </div>
            <a
              href="http://online.gov.vn/Home/WebDetails/88742"
              target="_blank"
            >
              <img
                src="//bizweb.dktcdn.net/100/416/540/themes/839121/assets/logo_bct.png"
                alt="Logo BCT"
              />
            </a>
          </div>

          <!-- Policies -->
          <div class="footer-click">
            <h4>Chính sách</h4>
            <ul class="toggle-mn">
              <li>
                <a href="/chinh-sach-van-chuyen">Chính sách vận chuyển</a>
              </li>
              <li>
                <a href="/chinh-sach-bao-mat">Chính sách bảo mật thông tin</a>
              </li>
              <li>
                <a href="/chinh-sach-doi-hang"
                  >Chính sách đổi hàng & bảo hành</a
                >
              </li>
            </ul>
          </div>

          <!-- About -->
          <div class="footer-click">
            <h4>Về Thế Giới Sữa</h4>
            <ul class="toggle-mn">
              <li>
                <a href="/gioi-thieu-the-gioi-sua">Giới thiệu Thế Giới Sữa</a>
              </li>
              <li>
                <a href="https://thegioisua.com/he-thong-cua-hang"
                  >Hệ thống cửa hàng</a
                >
              </li>
              <li><a href="/the-gioi-sua-tuyen-dung">Tuyển dụng</a></li>
              <li><a href="/lien-he">Liên hệ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="bottom-footer">
      <div class="container">
        <div id="copyright" class="fot_copyright">
          @ Bản quyền thuộc về <b>thegioisua.com</b> <br />
          <a href="https://podsanda.vn"
            >Pod Sanda chuyên cung cấp pod vape juice tại HCM, Hà Nội</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { IoLogoFacebook } from "@kalimahapps/vue-icons";
import { AkYoutubeFill } from "@kalimahapps/vue-icons";
import { AkTwitterFill } from "@kalimahapps/vue-icons";
import { AkInstagramFill } from "@kalimahapps/vue-icons";
</script>

<style scoped>
.footer {
  background-color: #8b4513;
  color: white;
  padding: 40px 0;
}

.footer h4 {
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.footer ul {
  list-style: none;
  padding: 0;
}

.footer ul li {
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.footer ul li a {
  color: white;
  text-decoration: none;
}

.footer ul li a:hover {
  text-decoration: underline;
}

.social-icons {
  margin: 20px 0;
}

.social-icons a {
  display: inline-block;
  margin-right: 15px;
  color: white;
  font-size: 18px;
}

.social-icons a:hover {
  color: #ffcc00;
}

.footer img {
  max-width: 60%;
}

.bottom-footer {
  background-color: #8b4513;
  padding: 20px 0;
  text-align: center;
  color: white;
}

.bottom-footer a {
  color: white;
  text-decoration: none;
}

.bottom-footer a:hover {
  text-decoration: underline;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-click {
  flex: 1;
  min-width: 220px;
  padding: 15px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .footer-click {
    padding: 10px 0;
  }
}
</style>
