import SectionShell from '../../components/ui/SectionShell';
import SectionHeading from '../../components/ui/SectionHeading';
import Reveal from '../../components/ui/Reveal';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import ContactForm from './ContactForm';
import { SECTION, CONTACT_DETAILS } from '../../data/content';
import styles from './Contact.module.css';

export default function Contact() {
  const s = SECTION.contact;
  const d = CONTACT_DETAILS;
  return (
    <SectionShell bgImage={s.bgImage}>
      <SectionHeading title={s.title} role={s.role} />

      <div className={styles.details}>
        <a href={`mailto:${d.email}`}>
          <Icon name="mail" size={16} className={styles.dicon} /> {d.email}
        </a>
        <span className={styles.sep}>·</span>
        <a href={d.phoneHref}>
          <Icon name="phone" size={16} className={styles.dicon} /> {d.phoneDisplay}
        </a>
        <span className={styles.sep}>·</span>
        <span className={styles.loc}>
          <Icon name="pin" size={16} className={styles.dicon} /> {d.location}
        </span>
      </div>

      <Reveal variant="up" className={styles.formWrap}>
        <Card soft className={styles.formCard}>
          <ContactForm />
        </Card>
      </Reveal>
    </SectionShell>
  );
}
