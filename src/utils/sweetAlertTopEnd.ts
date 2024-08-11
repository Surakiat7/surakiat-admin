import Swal, { SweetAlertIcon } from "sweetalert2";

export function SwalTopEnd(
  title: string,
  status: SweetAlertIcon,
  text?: string,
  onCloseFn?: () => any
): void {
  const timer = 2;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: timer * 1000,
    timerProgressBar: true,
  });

  Toast.fire({
    title: title,
    text: text,
    icon: status,
  }).then(() => {
    if (onCloseFn) onCloseFn();
  });
}
