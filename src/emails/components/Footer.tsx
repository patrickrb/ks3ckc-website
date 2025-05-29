import { Link, Section } from '@react-email/components';

import { styles } from '@/emails/styles';

export const Footer = () => {
  return (
    <Section style={styles.footer}>
      <Link style={styles.link} href="https://ks3ckc.radio" target="_blank">
        📻 KS3CKC Radio
      </Link>
      <br />
      Kansas City Amateur Radio Club
    </Section>
  );
};
