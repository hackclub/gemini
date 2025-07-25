export interface Step {
  heading: string;
  description: string;
  link?: string;
  primary?: boolean;
}

export const steps: Step[] = [
  {
    heading: "Pitch your idea",
    description: "Submit the proposal form to pitch your idea. We'll review it and get back to you.",
    link: "https://forms.hackclub.com/t/3KUTJRwTFous",
    primary: true,
  },
  {
    heading: "Build your app",
    description: "Flesh out your app even more and try to meet all the submission requirements.",
  },
  {
    heading: "Submit your app",
    description:
      "Submit your app to the submission form.",
    link: "https://forms.hackclub.com/t/e5LgW4Qqtbus",
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
  {
    heading: "Receive Free Android Merch!",
    description:
      "Choose from a variety of free Android merch!",
    primary: true,
  },
]; 
