import Navbar from "../../components/Navbar/Navbar";
import styles from "./AboutUsPage.module.css";
import BannerImage from "../../assets/images/Logo.png";

export default function AboutUsPage(): JSX.Element {
  return (
    <>
      <Navbar centerContent="About Us" />
      <div className={`${styles.fullPage} pageWrapper`}>
        <h1>About Us</h1>
        <p>
          Welcome to our app, a dedicated platform designed specifically for
          patients, their families, and caretakers. We understand the importance
          of keeping track of tasks and appointments, and our goal is to empower
          you to manage your care efficiently and effectively.
        </p>

        <h2>What We Do</h2>
        <p>Our app provides a user-friendly solution that enables you to:</p>
        <ul>
          <li>
            <strong>Create To-Dos:</strong> As a family member or caretaker, you
            can easily create, manage, and track tasks tailored to the needs of
            the patient. This ensures that important daily activities are
            completed and nothing is overlooked.
          </li>
          <li>
            <strong>Schedule Appointments:</strong> You can seamlessly add and
            manage appointments, helping to ensure that all essential medical
            visits and activities are organized and easily accessible.
          </li>
        </ul>

        <h2>Who We Are</h2>
        <p>
          We are a passionate team of four interns who joined forces to develop
          this project from scratch. With a shared commitment to improving
          patient care, we have designed this app to prioritize the needs of
          users like you, ensuring that your caregiving experience is as smooth
          and supportive as possible.
        </p>

        <h2>Our Technology Stack</h2>
        <p>
          To build this app, we utilized cutting-edge technologies, including:
        </p>
        <ul>
          <li>
            <strong>Figma:</strong> For creating intuitive user interfaces that
            enhance your overall experience.
          </li>
          <li>
            <strong>React:</strong> A robust library that allows us to build
            dynamic, responsive user interfaces tailored to your needs.
          </li>
          <li>
            <strong>TypeScript:</strong> Ensuring a safer and more reliable
            coding experience for better performance.
          </li>
          <li>
            <strong>Firebase (with Firestore):</strong> For secure data storage
            and real-time database functionality, ensuring that your information
            is always up-to-date and accessible.
          </li>
        </ul>
        <p className={styles.lastParagraph}>
          Thank you for choosing our app as your partner in caregiving. We are
          committed to continuously improving our platform, listening to your
          feedback, and enhancing your experience as you navigate the care
          journey for your loved ones.
        </p>

        <img src={BannerImage} alt="Picture of someone holding hands" />
      </div>
    </>
  );
}
