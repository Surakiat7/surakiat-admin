import Swal, { SweetAlertIcon } from "sweetalert2";

export function SwalCenter(
  title: string,
  status: SweetAlertIcon,
  text?: string,
  onCloseFn?: () => any,
  callbackFn?: () => any
): void {
  const timer = 2;
  const Toast = Swal.mixin({
    showConfirmButton: false,
    timer: timer * 1000,
    timerProgressBar: true,
    heightAuto: false,
    customClass: {
      icon: "swal2-icon-center",
    },
  });

  Toast.fire({
    title: title,
    text: text,
    icon: status,
  }).then(() => {
    if (onCloseFn) onCloseFn();
    if (callbackFn) callbackFn();
  });
}
