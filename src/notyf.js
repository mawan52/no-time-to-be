import { Notyf } from "notyf";

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'center',
    y: 'bottom',
  },
})

export async function timeNotifications(notifications, tDelay, tError) {
  for (const notification of notifications) {
    notyf.success(notification);

    const delay = tDelay+ (Math.random() * 2 - 1) * tError;

    await new Promise(resolve => setTimeout(resolve, delay));
  }
}


export default notyf;
