export interface Step {
  heading: string;
  description: string;
  link?: string;
  primary?: boolean;
}

export const steps: Step[] = [
  {
    heading: "Build your app",
    description: "Flesh out your app even more and try to meet all the submission requirements.",
  },
  {
    heading: "Submit your app",
    description:
      "Make a pull request adding a folder with your app's name in the submissions folder.",
    link: "https://github.com/hackclub/gemini#make-your-pr",
    primary: true,
  },
  {
    heading: "Recieve your Android Phone",
    description:
      "Receive a $25 grant for a Google Play Developer account and a free Android Phone to test your app.",
  },
  {
    heading: "Publish your app on the Play Store",
    description:
      "Publish your app on the Play Store.",
    primary: true,
  },
]; 