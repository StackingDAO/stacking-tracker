import { Bubble } from "./Bubble";
import { SubFooter } from "./SubFooter";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <SubFooter />
      <Bubble position="-bottom-[520px] -right-[270px] " />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="md:flex md:justify-center space-x-6 md:order-2">
          <div className="md:flex md:items-center gap-2">
            <p className="text-center text-white text-sm">
              This website and data are powered by
            </p>
            <a
              className="md:flex md:items-center md:justify-center mt-2 md:mt-0"
              href="https://www.stackingdao.com/"
            >
              <svg
                width="159"
                height="24"
                viewBox="0 0 159 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mt-2 md:mt-0"
              >
                <path
                  d="M41.9897 14.9302C41.9897 14.5196 41.8229 14.1925 41.4906 13.9502C41.157 13.7078 40.6089 13.5301 39.8439 13.4184L37.494 13.0642C35.6934 12.7783 34.3861 12.3112 33.572 11.6641C32.758 11.017 32.351 10.1216 32.351 8.97681C32.351 7.72023 32.9155 6.74368 34.0432 6.04597C35.1721 5.34945 36.729 5.00118 38.715 5.00118C40.5529 5.00118 41.9745 5.31179 42.9798 5.9342C43.9851 6.5566 44.6288 7.52022 44.9134 8.82738L41.8054 9.18153C41.571 8.55913 41.2072 8.11203 40.7139 7.83789C40.2206 7.56492 39.5232 7.42727 38.6229 7.42727C37.6479 7.42727 36.8957 7.55198 36.3663 7.80024C35.8356 8.04967 35.5709 8.4097 35.5709 8.88268C35.5709 9.30625 35.7284 9.62275 36.0432 9.83453C36.3581 10.0463 36.9284 10.2146 37.7541 10.3381L40.5296 10.7864C42.1821 11.0476 43.3845 11.5017 44.1367 12.1488C44.8889 12.796 45.2656 13.6984 45.2656 14.8549C45.2656 16.1986 44.7163 17.2257 43.6189 17.9352C42.5215 18.6447 40.9238 18.9988 38.827 18.9988C34.5843 18.9988 32.3079 17.4928 32 14.482H35.256C35.3913 15.1914 35.7528 15.7174 36.3383 16.0598C36.9237 16.4021 37.7599 16.5727 38.8456 16.5727C39.8695 16.5727 40.6497 16.4327 41.1862 16.1527C41.7226 15.8727 41.9909 15.4656 41.9909 14.9302H41.9897Z"
                  fill="#7BF178"
                />
                <path
                  d="M51.276 8.04262H46.1879V5.33651H59.619V8.04262H54.5309V18.6635H51.2748V8.04262H51.276Z"
                  fill="#7BF178"
                />
                <path
                  d="M61.3964 18.6623H58.0482L64.0052 5.33533H67.7417L73.6987 18.6623H70.2572L69.0362 15.8256H62.5614L61.3964 18.6623ZM65.8186 7.96731L63.5795 13.3242H68.0752L65.8186 7.96731Z"
                  fill="#7BF178"
                />
                <path
                  d="M73.9402 11.9994C73.9402 10.6428 74.2294 9.4392 74.8102 8.38734C75.3898 7.33549 76.2353 6.50836 77.3443 5.90478C78.4545 5.3012 79.805 5 81.3957 5C85.0961 5 87.341 6.54248 88.1294 9.62862L84.9107 10.0016C84.6273 9.19329 84.2074 8.60854 83.6523 8.24733C83.0972 7.88612 82.345 7.70611 81.3957 7.70611C80.1257 7.70611 79.1298 8.07908 78.4079 8.8262C77.686 9.57332 77.3257 10.6311 77.3257 11.9994C77.3257 13.3678 77.686 14.4255 78.4079 15.1726C79.1298 15.9197 80.1432 16.2927 81.4517 16.2927C83.5112 16.2927 84.7206 15.4962 85.0774 13.9031H88.3521C88.1667 15.5209 87.467 16.7751 86.2518 17.6646C85.0366 18.5541 83.4179 18.9988 81.3957 18.9988C79.7922 18.9988 78.4359 18.7035 77.3257 18.1117C76.2154 17.5199 75.3734 16.6998 74.8008 15.648C74.2271 14.5961 73.9402 13.3807 73.9402 11.9994Z"
                  fill="#7BF178"
                />
                <path
                  d="M90.7007 5.33651H93.9567V11.0111L100.266 5.33651H104.04L98.4524 10.4322L104.576 18.6635H100.802L96.1958 12.4477L93.9567 14.3702V18.6635H90.7007V5.33651Z"
                  fill="#7BF178"
                />
                <path
                  d="M106.797 5.33651H110.053V18.6635H106.797V5.33651Z"
                  fill="#7BF178"
                />
                <path
                  d="M113.494 5.33651H116.435L123.78 14.2396V5.33651H126.888V18.6635H123.947L116.602 9.74158V18.6635H113.494V5.33651Z"
                  fill="#7BF178"
                />
                <path
                  d="M129.552 12.0559C129.552 10.5499 129.873 9.27448 130.514 8.22968C131.155 7.18489 132.05 6.38482 133.196 5.83066C134.344 5.27767 135.669 5 137.174 5C139.048 5 140.526 5.38944 141.605 6.16598C142.683 6.94369 143.396 7.94848 143.741 9.18035L140.485 9.5345C140.238 8.87562 139.84 8.39323 139.292 8.08849C138.743 7.78376 138.013 7.63081 137.1 7.63081C135.718 7.63081 134.669 8.01319 133.954 8.77914C133.239 9.54391 132.881 10.6181 132.881 11.9994C132.881 14.9114 134.429 16.3668 137.525 16.3668C138.894 16.3668 140.048 16.1609 140.985 15.7515V13.6984H137.525V11.2723H144V17.1704C143.149 17.7552 142.168 18.2058 141.059 18.5235C139.95 18.8412 138.777 19 137.544 19C135.867 19 134.432 18.7259 133.243 18.1788C132.052 17.6316 131.14 16.8375 130.505 15.7986C129.869 14.7596 129.552 13.5125 129.552 12.0559Z"
                  fill="#7BF178"
                />
                <path
                  d="M145.556 5.09223H147.184C147.879 5.09223 148.411 5.25101 148.78 5.56973C149.149 5.88845 149.333 6.34611 149.333 6.94386C149.333 7.54161 149.136 7.99576 148.743 8.31565C148.349 8.63554 147.79 8.79549 147.063 8.79549H145.556V5.09223ZM148.673 6.94386C148.673 6.06591 148.178 5.62694 147.187 5.62694H146.191V8.26195H147.082C147.605 8.26195 148.001 8.15104 148.27 7.93038C148.539 7.70973 148.673 7.3805 148.673 6.94503V6.94386Z"
                  fill="#7BF178"
                />
                <path
                  d="M149.796 8.79549L151.582 5.09223H152.272L154.058 8.79549H153.363L152.91 7.84165H150.909L150.466 8.79549H149.796ZM151.913 5.69348L151.139 7.3373H152.687L151.913 5.69348Z"
                  fill="#7BF178"
                />
                <path
                  d="M154.516 6.94386C154.516 6.54692 154.604 6.20251 154.779 5.9118C154.955 5.6211 155.202 5.39695 155.521 5.23817C155.84 5.07939 156.216 5 156.649 5C157.082 5 157.461 5.07939 157.779 5.23817C158.097 5.39695 158.343 5.62227 158.517 5.9118C158.691 6.20251 158.778 6.54575 158.778 6.94386C158.778 7.34197 158.69 7.68171 158.515 7.97358C158.339 8.26545 158.092 8.49195 157.775 8.65072C157.457 8.8095 157.08 8.88889 156.644 8.88889C156.209 8.88889 155.837 8.8095 155.517 8.65072C155.196 8.49195 154.95 8.26662 154.777 7.97708C154.602 7.68638 154.516 7.34314 154.516 6.94503V6.94386ZM155.179 6.94386C155.179 7.38634 155.308 7.73191 155.565 7.97825C155.824 8.22576 156.184 8.34951 156.648 8.34951C157.112 8.34951 157.467 8.22459 157.725 7.97592C157.983 7.72724 158.111 7.38284 158.111 6.94386C158.111 6.50489 157.983 6.15698 157.727 5.90947C157.471 5.66196 157.11 5.53821 156.647 5.53821C156.183 5.53821 155.826 5.66196 155.566 5.90947C155.307 6.15698 155.176 6.50139 155.176 6.94386H155.179Z"
                  fill="#7BF178"
                />
                <path
                  d="M22.1484 0H1.85159C0.828986 0 0 0.828986 0 1.85159V22.1484C0 23.171 0.828986 24 1.85159 24H22.1484C23.171 24 24 23.171 24 22.1484V1.85159C24 0.828986 23.171 0 22.1484 0Z"
                  fill="#1C3830"
                />
                <path
                  d="M18.7474 8.74812L18.0905 8.23584C17.3267 7.64007 16.3857 7.31739 15.4178 7.31739H6.57592V3.6001H15.4169C17.212 3.6001 18.9559 4.19935 20.3722 5.30306L21.0282 5.81447L18.7474 8.74726V8.74812Z"
                  fill="#7BF178"
                />
                <path
                  d="M13.8018 20.3992H8.01146C6.21633 20.3992 4.47246 19.8 3.05616 18.6963L2.40015 18.1849L4.68099 15.2521L5.33788 15.7635C6.1025 16.3593 7.04351 16.6828 8.01233 16.6828H13.8026V20.4001L13.8018 20.3992Z"
                  fill="#7BF178"
                />
                <path
                  d="M15.0652 10.1423H9.39741C7.84122 10.1423 6.57524 8.87511 6.57524 7.31739H2.86159C2.86159 10.9242 5.79324 13.8588 9.39654 13.8588H15.0643C16.6205 13.8588 17.8865 15.126 17.8865 16.6837H21.6001C21.6001 13.0769 18.6685 10.1423 15.0652 10.1423Z"
                  fill="#7BF178"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-white/50 text-sm text-center md:text-left">
            © Stacks Labs 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
