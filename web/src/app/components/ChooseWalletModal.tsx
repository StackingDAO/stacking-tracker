// @ts-nocheck

import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon, PlusIcon } from "@heroicons/react/20/solid";

type Props = {
  open: boolean;
  closeModal: () => void;
  onProviderChosen: (arg0: string) => void;
};

export function ChooseWalletModal({
  open,
  closeModal,
  onProviderChosen,
}: Props) {
  const [xVerseInstalled, setXVerseInstalled] = useState(false);

  useEffect(() => {
    if (
      window.XverseProviders?.StacksProvider ||
      (window.StacksProvider && !window.StacksProvider.isLeather)
    ) {
      setXVerseInstalled(true);
    }
  }, [window.XverseProviders]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-gray border border-white/10 shadow-xl rounded-2xl sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h1"
                        className="text-lg leading-6 sm:text-2xl font-headings font-semibold"
                      >
                        Select wallet
                      </Dialog.Title>
                      <button
                        type="button"
                        className="bg-transparent rounded-md text-dark-green-400 hover:text-dark-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        onClick={closeModal}
                      >
                        <span className="sr-only">Close</span>
                        <PlusIcon className="text-orange w-10 h-10 rotate-45" />
                      </button>
                    </div>
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => {
                          onProviderChosen("leather");
                        }}
                        type="button"
                        disabled={
                          !window.LeatherProvider && !window.HiroWalletProvider
                        }
                        className="flex items-center w-full -ml-2.5 bg-transparent rounded-md gap-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/[0.05] disabled:hover:bg-white/[0.02] disabled:cursor-not-allowed"
                      >
                        <span>
                          <svg
                            width="58"
                            height="57"
                            viewBox="0 0 58 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_d_324_1489)">
                              <rect
                                x="9"
                                y="7"
                                width="40"
                                height="40"
                                rx="8"
                                fill="#181818"
                              />
                            </g>
                            <path
                              d="M31.2269 24.3192C33.0528 24.0354 35.6934 22.1064 35.6934 20.6028C35.6934 20.1489 35.3282 19.8369 34.7945 19.8369C33.7832 19.8369 32.0696 21.3688 31.2269 24.3192ZM22.7714 31.7802C20.3836 31.7802 20.187 34.1631 22.5748 34.1631C23.6422 34.1631 24.9344 33.7376 25.6086 32.9716C24.6254 32.1206 23.8108 31.7802 22.7714 31.7802ZM37.9688 30.7589C38.1092 34.7589 36.0867 37 32.6595 37C30.637 37 29.6257 36.2341 27.4627 34.8156C26.339 36.0638 24.204 37 22.4343 37C16.3385 37 16.5913 29.1986 22.7995 29.1986C24.0917 29.1986 25.1873 29.539 26.5918 30.4185L27.5188 27.156C23.6984 26.1064 21.7882 23.156 23.6703 18.9291H26.7042C25.0187 21.7376 26.1705 24.0638 28.3054 24.3192C29.4571 20.2057 31.9292 17 35.2158 17C37.0699 17 38.5306 18.2199 38.5306 20.4326C38.5306 23.9787 33.9237 26.8724 30.4403 27.156L29.0076 32.2341C30.637 34.1347 35.1596 35.9787 35.1596 30.7589H37.9688Z"
                              fill="#F5F1ED"
                            />
                            <defs>
                              <filter
                                id="filter0_d_324_1489"
                                x="0.666667"
                                y="0.333334"
                                width="56.6667"
                                height="56.6667"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset dy="1.66667" />
                                <feGaussianBlur stdDeviation="4.16667" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_324_1489"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect1_dropShadow_324_1489"
                                  result="shape"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span>Leather Wallet</span>
                          {!window.LeatherProvider &&
                            !window.HiroWalletProvider && (
                              <span className="text-sm text-white/[0.35]">
                                Not installed -{" "}
                                <a
                                  href="https://leather.io/install-extension"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                  className="inline-flex items-center hover:underline text-orange"
                                >
                                  Download
                                  <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1 text-orange" />
                                </a>
                              </span>
                            )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onProviderChosen("xverse");
                        }}
                        disabled={!xVerseInstalled}
                        className="flex items-center w-full -ml-2.5 bg-transparent rounded-md gap-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/[0.05] disabled:hover:bg-white/[0.02] disabled:cursor-not-allowed"
                      >
                        <span>
                          <svg
                            width="58"
                            height="57"
                            viewBox="0 0 58 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_d_324_1497)">
                              <rect
                                x="9"
                                y="7"
                                width="40"
                                height="40"
                                rx="8"
                                fill="#181818"
                              />
                            </g>
                            <path
                              d="M37.9668 35.7336V32.4678C37.9668 32.3372 37.9018 32.2066 37.8366 32.1085L23.9384 18.1306C23.8407 18.0327 23.7105 18 23.5804 18H20.3255C20.1627 18 20.0325 18.1306 20.0325 18.2939V21.3312C20.0325 21.4618 20.0976 21.5925 20.1627 21.6904L25.1427 26.6872C25.2729 26.8178 25.2729 26.9811 25.1427 27.1118L20.0976 32.1739C20.0325 32.2391 20 32.3045 20 32.3699V35.7011C20 35.8643 20.1302 35.995 20.2929 35.995H25.7611C25.9238 35.995 26.054 35.8643 26.054 35.7011V33.7414C26.054 33.6762 26.0866 33.5781 26.1517 33.5456L28.8532 30.8349C28.9834 30.7043 29.1462 30.7043 29.2763 30.8349L34.2889 35.8643C34.3865 35.9623 34.5166 35.995 34.6468 35.995H37.6739C37.8366 36.0276 37.9668 35.8969 37.9668 35.7336Z"
                              fill="white"
                            />
                            <path
                              d="M30.644 22.311H33.3781C33.5408 22.311 33.671 22.4416 33.671 22.6049V25.3482C33.671 25.6095 33.9965 25.7401 34.1592 25.5442L37.9023 21.7884C37.9674 21.7231 38 21.6578 38 21.5925V18.2939C38 18.1306 37.8698 18 37.7071 18H34.3871C34.322 18 34.2244 18.0327 34.1918 18.098L30.4487 21.8211C30.2534 21.9844 30.3836 22.311 30.644 22.311Z"
                              fill="#EE7A30"
                            />
                            <defs>
                              <filter
                                id="filter0_d_324_1497"
                                x="0.666667"
                                y="0.333334"
                                width="56.6667"
                                height="56.6667"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset dy="1.66667" />
                                <feGaussianBlur stdDeviation="4.16667" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_324_1497"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect1_dropShadow_324_1497"
                                  result="shape"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span>Xverse Wallet</span>
                          {!xVerseInstalled && (
                            <span className="text-sm text-white/[0.35]">
                              Not installed -{" "}
                              <a
                                href="https://www.xverse.app/download"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="inline-flex items-center hover:underline text-orange"
                              >
                                Download
                                <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1 text-orange" />
                              </a>
                            </span>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onProviderChosen("asigna");
                        }}
                        disabled={!window.AsignaProvider}
                        className="flex items-center w-full -ml-2.5 bg-transparent rounded-md gap-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/[0.05] disabled:hover:bg-white/[0.02] disabled:cursor-not-allowed"
                      >
                        <span>
                          <svg
                            width="58"
                            height="57"
                            viewBox="0 0 58 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_d_324_1502)">
                              <rect
                                x="9"
                                y="7"
                                width="40"
                                height="40"
                                rx="8"
                                fill="#181818"
                              />
                            </g>
                            <path
                              d="M28.3715 18.0861C27.7008 18.2545 27.1068 18.6609 26.7089 19.2368C26.678 19.2799 26.6498 19.323 26.6241 19.3674C26.6067 19.3917 26.5919 19.4173 26.5772 19.4428L26.1673 20.1575L26.1041 20.2679L25.6256 21.101L25.5759 21.1871L24.3435 23.3324L24.3004 23.405L23.8489 24.1924L23.7991 24.2786L23.3556 25.0511L23.2911 25.1656L21.7308 27.8816L21.6675 27.9892L21.2966 28.6351L21.2522 28.7145L20.5507 29.9339L20.2147 30.5193L19.8357 31.1802L19.7832 31.2704L18.79 32.9998L18.6852 33.1829L18.5575 33.4036L18.4822 33.5369L18.1717 34.0765C18.1583 34.0995 18.1463 34.1237 18.1341 34.1478C18.1314 34.1506 18.1301 34.1546 18.1301 34.1546C18.0562 34.3054 18.0158 34.4615 18.0038 34.6163C17.9528 35.2676 18.4151 35.8921 19.1005 35.9864C19.13 35.9917 19.1596 35.9944 19.1891 35.9971C19.2201 35.9984 19.251 35.9998 19.2819 35.9998H20.6219L20.6636 35.9392L20.708 35.8746L21.5345 34.6849L21.5869 34.6095L22.3221 33.5503L22.3664 33.4856L22.7535 32.9285L22.8005 32.8611L23.0291 32.5315C23.322 32.1088 23.8005 31.8908 24.2789 31.9123C24.3045 31.9123 24.3313 31.9138 24.357 31.9165C24.5436 31.9338 24.7278 31.9877 24.9013 32.082C24.9254 32.0927 24.9496 32.1061 24.9724 32.121C24.9979 32.1357 25.0235 32.152 25.0478 32.1695C25.4523 32.4519 25.6699 32.9043 25.6699 33.3632V33.374C25.6699 33.4089 25.6686 33.4426 25.6646 33.4776C25.6458 33.7253 25.5638 33.9715 25.412 34.1909L24.8071 35.063L24.7628 35.1276L24.455 35.5691L24.3973 35.6525L24.3179 35.767L24.2104 35.9217L24.1567 35.9998H26.092C26.127 35.9998 26.1632 35.9984 26.1981 35.9971C26.877 35.9649 27.5032 35.6189 27.8944 35.0604L29.0165 33.4534L29.7599 32.3888L30.9962 30.619C31.0701 30.514 31.1576 30.4239 31.2557 30.3498C31.3094 30.3094 31.3645 30.2744 31.4223 30.2435C31.4572 30.226 31.4922 30.2099 31.5272 30.195H31.5285C31.5513 30.1857 31.5741 30.1762 31.5971 30.1681C31.6293 30.1573 31.6629 30.1479 31.6965 30.1399C31.7261 30.1318 31.757 30.1264 31.7879 30.1224C31.7947 30.1196 31.8013 30.1183 31.8094 30.1183C31.8349 30.1142 31.8618 30.1102 31.8872 30.1089H31.8887C31.921 30.1061 31.9532 30.1048 31.9855 30.1048C32.2341 30.1048 32.4854 30.1829 32.7004 30.3417C32.7301 30.3633 32.7583 30.3862 32.7852 30.4104C32.8067 30.4292 32.8256 30.4467 32.8443 30.4669C32.8725 30.4951 32.8994 30.5262 32.9236 30.5572C32.9451 30.584 32.9665 30.6122 32.9853 30.6406C33.0283 30.7038 33.0647 30.771 33.093 30.8396C33.1024 30.8612 33.1103 30.8828 33.1184 30.9043C33.1265 30.9259 33.1333 30.9473 33.14 30.9689C33.1534 31.0146 33.1628 31.0604 33.1709 31.1062C33.1803 31.1519 33.1856 31.1977 33.187 31.2435C33.1964 31.4157 33.1709 31.5895 33.1049 31.7549C33.0714 31.841 33.027 31.9232 32.9733 32.0025L32.9411 32.0483V32.0496L32.3995 32.8262L31.722 33.7993L31.468 34.164C31.4143 34.2421 31.3699 34.3242 31.3376 34.4063C31.3148 34.4615 31.2973 34.5179 31.2852 34.5732C31.2785 34.6014 31.2732 34.6311 31.2691 34.6594C31.257 34.7347 31.2544 34.81 31.2583 34.8854C31.2597 34.9042 31.261 34.9231 31.2625 34.9419C31.2677 34.9971 31.2772 35.0523 31.2905 35.1075C31.2946 35.1237 31.2986 35.1385 31.3027 35.1533C31.3242 35.2272 31.3537 35.3 31.3887 35.3685C31.3968 35.3834 31.4049 35.3981 31.4129 35.4116C31.4317 35.4452 31.4519 35.4777 31.4746 35.5086C31.4746 35.5099 31.4761 35.5112 31.4761 35.5112C31.4935 35.5354 31.5124 35.5597 31.5312 35.5825C31.542 35.596 31.5526 35.6082 31.5648 35.6217C31.5837 35.6418 31.6025 35.6621 31.6225 35.6809C31.6252 35.6835 31.6279 35.6875 31.632 35.6889C31.6562 35.7118 31.6817 35.7333 31.7072 35.7549C31.7099 35.7562 31.7112 35.7575 31.7126 35.7589C31.7274 35.771 31.7421 35.7818 31.7583 35.7925C31.7717 35.802 31.7852 35.8113 31.7986 35.8194C31.8242 35.8356 31.8511 35.8517 31.878 35.8652C31.9007 35.8787 31.925 35.8894 31.9491 35.9002C31.9506 35.9015 31.9517 35.9015 31.9517 35.9015C31.9774 35.9136 32.0029 35.923 32.0297 35.9325C32.0796 35.95 32.132 35.9649 32.1857 35.9756C32.2019 35.9796 32.2192 35.9823 32.2368 35.9849C32.2691 35.9904 32.3013 35.9944 32.3349 35.9958C32.3643 35.9984 32.394 35.9998 32.425 35.9998H39.0267C39.1195 35.9998 39.2109 35.9904 39.2969 35.9728C39.3183 35.9688 39.3399 35.9635 39.3614 35.9581C39.4245 35.942 39.4864 35.9217 39.5455 35.8962C39.5697 35.8854 39.594 35.8746 39.6181 35.8625C39.6395 35.8531 39.6598 35.8423 39.6799 35.8302C39.6826 35.8275 39.6852 35.8262 39.688 35.8248C39.7417 35.7952 39.7927 35.7602 39.8412 35.7225C39.8505 35.7158 39.86 35.7077 39.8694 35.6996C39.8922 35.6809 39.9137 35.6621 39.9351 35.6418C39.9594 35.6189 39.9822 35.5947 40.0051 35.5691C40.0266 35.5476 40.0468 35.5247 40.0656 35.5018C40.0938 35.4641 40.1221 35.4251 40.1476 35.3862C40.157 35.3713 40.1664 35.3551 40.1758 35.3391C40.1973 35.3013 40.2188 35.261 40.2377 35.2205C40.2443 35.203 40.2525 35.1856 40.2591 35.1679C40.2779 35.1237 40.2928 35.0792 40.3062 35.0334C40.3129 35.0119 40.3183 34.9917 40.3223 34.9702C40.3276 34.9513 40.3316 34.9324 40.3343 34.9137C40.3357 34.907 40.3372 34.8989 40.3384 34.8921L40.3424 34.872C40.3465 34.8464 40.3492 34.8194 40.3519 34.7925C40.3546 34.7655 40.3573 34.7387 40.3573 34.7104C40.3654 34.4708 40.3075 34.2219 40.1704 33.9892L38.633 31.3915L38.5725 31.2893L38.3869 30.9757L38.0711 30.4426V30.4413L38.0643 30.4305L38.0213 30.3579L36.7701 28.2448L36.7122 28.1466L36.6734 28.0806L35.9073 26.786L35.8642 26.7146L35.6693 26.3834L35.5874 26.2475L35.492 26.0847L34.9745 25.2099L34.8549 25.0081L34.7701 24.8654L32.6938 21.3553L32.6534 21.288L31.9613 20.1171L31.9183 20.0458L31.542 19.4091C31.4842 19.3122 31.4223 19.2194 31.3537 19.1319C31.3215 19.0888 31.2879 19.0458 31.2517 19.0055C31.2436 18.9947 31.2341 18.9839 31.2234 18.9731C31.1993 18.9448 31.1737 18.9166 31.1468 18.8897C30.964 18.6972 30.7557 18.533 30.5299 18.3997C30.5178 18.3917 30.5044 18.3836 30.4922 18.3769C30.4358 18.3446 30.378 18.3137 30.3189 18.2853C30.0984 18.1791 29.8646 18.101 29.6213 18.0539C29.4412 18.0189 29.2571 18 29.069 18C28.8311 18 28.5959 18.0296 28.3715 18.0861Z"
                              fill="url(#paint0_linear_324_1502)"
                            />
                            <path
                              d="M32.0815 28.6624C32.064 28.6853 32.0465 28.7095 32.029 28.7337C31.646 29.2653 31.4229 29.8306 31.3221 30.1321C31.3127 30.1576 31.3046 30.1832 31.2978 30.2047C31.2683 30.2963 31.2549 30.3501 31.2549 30.3501C31.3086 30.3097 31.3638 30.2747 31.4216 30.2438C31.4565 30.2263 31.4915 30.2102 31.5265 30.1953H31.5278C31.5506 30.1846 31.5734 30.1765 31.5963 30.1684C31.6285 30.1576 31.6621 30.1482 31.6957 30.1402C31.7253 30.1321 31.7562 30.1267 31.7871 30.1227C31.7939 30.1199 31.8006 30.1186 31.8086 30.1186C31.8342 30.1145 31.861 30.1105 31.8865 30.1092H31.888C31.9202 30.1064 31.9524 30.1051 31.9847 30.1051C32.2334 30.1051 32.4847 30.1832 32.6997 30.342C32.7293 30.3636 32.7575 30.3865 32.7844 30.4107C32.8059 30.4295 32.8248 30.447 32.8435 30.4672C32.8717 30.4954 32.8987 30.5265 32.9228 30.5575C32.9457 30.5843 32.9657 30.6112 32.9846 30.6409C33.0276 30.7041 33.0639 30.7713 33.0923 30.8399C33.1016 30.8615 33.1096 30.8831 33.1177 30.9046C33.1257 30.9262 33.1325 30.9476 33.1392 30.9692C33.1526 31.0149 33.162 31.0607 33.1701 31.1065C33.1782 31.1522 33.1836 31.198 33.1863 31.2438C33.1957 31.416 33.1701 31.5898 33.1042 31.7552C33.0707 31.8413 33.0263 31.9235 32.9725 32.0028L32.9403 32.0486V32.0499L32.3987 32.8265L31.7212 33.7996L31.4673 34.1643C31.4135 34.2424 31.3691 34.3245 31.3368 34.4066C31.3154 34.4618 31.2978 34.5182 31.2844 34.5735C31.2777 34.6017 31.2724 34.6314 31.2683 34.6597C31.2563 34.735 31.2536 34.8103 31.2576 34.8857C31.259 34.9045 31.2603 34.9234 31.2617 34.9422C31.267 34.9974 31.2764 35.0526 31.2898 35.1078C31.2939 35.124 31.2979 35.1388 31.302 35.1536C31.3235 35.2275 31.353 35.3003 31.388 35.3688C31.396 35.3823 31.4028 35.3957 31.4094 35.4093L31.4121 35.4119C31.431 35.4455 31.4512 35.478 31.4739 35.5089C31.4739 35.5102 31.4753 35.5115 31.4753 35.5115C31.4928 35.5357 31.5116 35.56 31.5305 35.5828C31.5412 35.5963 31.5519 35.6085 31.564 35.622C31.5829 35.6421 31.6017 35.6624 31.6218 35.6812C31.6245 35.6838 31.6271 35.6878 31.6312 35.6892C31.6555 35.7121 31.6809 35.7336 31.7065 35.7552C31.7092 35.7565 31.7105 35.7578 31.7119 35.7592C31.7266 35.7713 31.7414 35.7821 31.7575 35.7928C31.771 35.8023 31.7845 35.8116 31.7979 35.8197C31.8234 35.8359 31.8503 35.852 31.8772 35.8655C31.9 35.879 31.9242 35.8897 31.9483 35.9005C31.9498 35.9018 31.951 35.9018 31.951 35.9018C31.9767 35.9139 32.0021 35.9233 32.029 35.9328C32.0788 35.9503 32.1313 35.9652 32.185 35.9759C32.2011 35.9799 32.2185 35.9826 32.236 35.9852C32.2684 35.9907 32.3005 35.9947 32.3341 35.9961C32.3636 35.9987 32.3933 36.0001 32.4243 36.0001H39.026C39.1187 36.0001 39.2101 35.9907 39.2961 35.9731C39.3175 35.9691 39.3391 35.9638 39.3606 35.9584C39.4238 35.9423 39.4856 35.922 39.5447 35.8965C39.569 35.8857 39.5932 35.8749 39.6173 35.8628C39.6387 35.8534 39.659 35.8426 39.6791 35.8305L39.6872 35.8265V35.8251C39.7409 35.7955 39.792 35.7605 39.8404 35.7228C39.8498 35.7161 39.8593 35.708 39.8686 35.6999C39.8915 35.6812 39.913 35.6624 39.9344 35.6421C39.9586 35.6192 39.9815 35.595 40.0043 35.5694C40.0258 35.5479 40.0461 35.525 40.0648 35.5021C40.0931 35.4644 40.1213 35.4254 40.1469 35.3865C40.1562 35.3716 40.1657 35.3554 40.1751 35.3394C40.1965 35.3016 40.2181 35.2613 40.2369 35.2208C40.2435 35.2033 40.2518 35.1859 40.2583 35.1682C40.2772 35.124 40.292 35.0795 40.3055 35.0337C40.3122 35.0122 40.3175 34.992 40.3216 34.9705C40.3269 34.9516 40.3309 34.9327 40.3336 34.914C40.3364 34.9005 40.339 34.887 40.3405 34.8735L40.3417 34.8723C40.3458 34.8467 40.3484 34.8197 40.3511 34.7928C40.3538 34.7658 40.3565 34.739 40.3565 34.7107C40.3646 34.4711 40.3067 34.2222 40.1697 33.9895L38.6322 31.3918L38.5717 31.2896L38.3862 30.976L38.0703 30.4429V30.4416L38.0636 30.4308L38.0205 30.3582L36.7693 28.2451C36.7344 28.2236 36.6994 28.2007 36.6644 28.1793C36.6403 28.1644 36.6161 28.1509 36.5906 28.1361C36.0382 27.8118 35.3313 27.5331 34.4967 27.4873C34.4698 27.4848 34.4429 27.4833 34.416 27.4833C34.3596 27.4807 34.303 27.4792 34.2452 27.4792C33.2521 27.4792 32.5531 28.0379 32.0815 28.6624Z"
                              fill="url(#paint1_linear_324_1502)"
                            />
                            <path
                              d="M25.6702 33.3636C25.6702 33.65 25.5865 33.9383 25.4114 34.1916L24.1567 35.9993H20.6221L23.0284 32.5318C23.4855 31.8734 24.3902 31.7117 25.0476 32.1695C25.4522 32.452 25.6702 32.904 25.6702 33.3636Z"
                              fill="white"
                            />
                            <path
                              d="M24.5858 33.5269C24.5858 33.8266 24.3431 34.0696 24.0438 34.0696C23.7446 34.0696 23.502 33.8266 23.502 33.5269C23.502 33.2272 23.7446 32.9841 24.0438 32.9841C24.3431 32.9841 24.5858 33.2272 24.5858 33.5269Z"
                              fill="black"
                            />
                            <defs>
                              <filter
                                id="filter0_d_324_1502"
                                x="0.666667"
                                y="0.333334"
                                width="56.6667"
                                height="56.6667"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset dy="1.66667" />
                                <feGaussianBlur stdDeviation="4.16667" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_324_1502"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect1_dropShadow_324_1502"
                                  result="shape"
                                />
                              </filter>
                              <linearGradient
                                id="paint0_linear_324_1502"
                                x1="28.4802"
                                y1="37.9863"
                                x2="32.5886"
                                y2="18.6849"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stop-color="#6522F4" />
                                <stop offset="0.5538" stop-color="#9B6BFF" />
                                <stop offset="1" stop-color="#A585FF" />
                              </linearGradient>
                              <linearGradient
                                id="paint1_linear_324_1502"
                                x1="35.5216"
                                y1="36.9405"
                                x2="37.749"
                                y2="27.9408"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stop-color="#421F8B" />
                                <stop offset="0.5538" stop-color="#7230FF" />
                                <stop offset="1" stop-color="#9773FF" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span>Asigna Wallet</span>
                          {!window.AsignaProvider && (
                            <span className="text-sm text-white/[0.35]">
                              Not installed -{" "}
                              <a
                                href="https://asigna.io/"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="inline-flex items-center hover:underline text-orange"
                              >
                                Download
                                <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1 text-orange" />
                              </a>
                            </span>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onProviderChosen("okx");
                        }}
                        disabled={!window.okxwallet}
                        className="flex items-center w-full -ml-2.5 bg-transparent rounded-md gap-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/[0.05] disabled:hover:bg-white/[0.02] disabled:cursor-not-allowed"
                      >
                        <span>
                          <svg
                            width="58"
                            height="57"
                            viewBox="0 0 58 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_d_324_1507)">
                              <rect
                                x="9"
                                y="7"
                                width="40"
                                height="40"
                                rx="8"
                                fill="#181818"
                              />
                            </g>
                            <path
                              d="M31.5976 24.0011H26.0403C25.8043 24.0011 25.6128 24.1801 25.6128 24.4011V29.601C25.6128 29.8219 25.8043 30.0009 26.0403 30.0009H31.5976C31.8337 30.0009 32.025 29.8219 32.025 29.601V24.4011C32.025 24.1801 31.8337 24.0011 31.5976 24.0011Z"
                              fill="white"
                            />
                            <path
                              d="M25.1867 18.0007H19.6296C19.3935 18.0007 19.2021 18.1798 19.2021 18.4007V23.6006C19.2021 23.8215 19.3935 24.0006 19.6296 24.0006H25.1867C25.4229 24.0006 25.6144 23.8215 25.6144 23.6006V18.4007C25.6144 18.1798 25.4229 18.0007 25.1867 18.0007Z"
                              fill="white"
                            />
                            <path
                              d="M38.0134 18.0007H32.4562C32.2202 18.0007 32.0287 18.1798 32.0287 18.4007V23.6006C32.0287 23.8215 32.2202 24.0006 32.4562 24.0006H38.0134C38.2496 24.0006 38.4409 23.8215 38.4409 23.6006V18.4007C38.4409 18.1798 38.2496 18.0007 38.0134 18.0007Z"
                              fill="white"
                            />
                            <path
                              d="M25.1867 30.0008H19.6296C19.3935 30.0008 19.2021 30.1799 19.2021 30.4008V35.6007C19.2021 35.8216 19.3935 36.0007 19.6296 36.0007H25.1867C25.4229 36.0007 25.6144 35.8216 25.6144 35.6007V30.4008C25.6144 30.1799 25.4229 30.0008 25.1867 30.0008Z"
                              fill="white"
                            />
                            <path
                              d="M38.0134 30.0008H32.4562C32.2202 30.0008 32.0287 30.1799 32.0287 30.4008V35.6007C32.0287 35.8216 32.2202 36.0007 32.4562 36.0007H38.0134C38.2496 36.0007 38.4409 35.8216 38.4409 35.6007V30.4008C38.4409 30.1799 38.2496 30.0008 38.0134 30.0008Z"
                              fill="white"
                            />
                            <defs>
                              <filter
                                id="filter0_d_324_1507"
                                x="0.666667"
                                y="0.333334"
                                width="56.6667"
                                height="56.6667"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset dy="1.66667" />
                                <feGaussianBlur stdDeviation="4.16667" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_324_1507"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect1_dropShadow_324_1507"
                                  result="shape"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </span>
                        <span className="flex flex-col text-left">
                          <span>OKX Wallet</span>
                          {!window.okxwallet && (
                            <span className="text-sm text-white/[0.35]">
                              Not installed -{" "}
                              <a
                                href="https://www.okx.com/web3"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="inline-flex items-center hover:underline text-orange"
                              >
                                Download
                                <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1 text-orange" />
                              </a>
                            </span>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
