import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import {
  AboutContent,
  AdminUser,
  BlogCategory,
  BlogPost,
  ContactInfo,
  ContactLead,
  Event,
  GalleryAlbum,
  GalleryImage,
  HomepageContent,
  LeadershipMember,
  MembershipContent,
  PageEngagementStat,
  Project,
  SiteSettings,
  SocialLink,
  Visitor,
  VisitorEvent,
  VisitorSession,
} from './entities';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'colombo_legacy',
    password: 'root',
    database: 'leo_lions_legacy',
    entities: [
      AdminUser,
      SiteSettings,
      HomepageContent,
      AboutContent,
      LeadershipMember,
      Project,
      Event,
      GalleryAlbum,
      GalleryImage,
      MembershipContent,
      BlogCategory,
      BlogPost,
      ContactInfo,
      ContactLead,
      SocialLink,
      Visitor,
      VisitorSession,
      VisitorEvent,
      PageEngagementStat,
    ],
    synchronize: true,
  });

  await dataSource.initialize();

  const adminRepo = dataSource.getRepository(AdminUser);
  if (!(await adminRepo.findOne({ where: { email: 'admin@colombolegacy.org' } }))) {
    await adminRepo.save(
      adminRepo.create({
        email: 'admin@colombolegacy.org',
        fullName: 'System Administrator',
        passwordHash: await bcrypt.hash('col.legacy.2026', 10),
        role: 'SUPER_ADMIN',
      }),
    );
  }

  const siteRepo = dataSource.getRepository(SiteSettings);
  if (!(await siteRepo.findOne({ where: {} }))) {
    await siteRepo.save(
      siteRepo.create({
        organizationName: 'Leo Lions Club of Colombo Legacy',
        theme: 'Empower You!',
        primaryColor: '#0F4C81',
        secondaryColor: '#1F7DBA',
        footerCopyright: 'Leo Lions Club of Colombo Legacy',
        defaultSeoTitle: 'Leo Lions Club of Colombo Legacy',
        defaultSeoDescription:
          'Official website of Leo Lions Club of Colombo Legacy - Empower You!',
      }),
    );
  }

  const homeRepo = dataSource.getRepository(HomepageContent);
  if (!(await homeRepo.findOne({ where: {} }))) {
    await homeRepo.save(
      homeRepo.create({
        heroTitle: 'Empower You!',
        heroSubtitle:
          'Building a dynamic and impactful generation of leaders through service, unity, and excellence.',
        ctaPrimaryLabel: 'Join Us',
        ctaPrimaryLink: '/membership',
        ctaSecondaryLabel: 'Explore Our Impact',
        ctaSecondaryLink: '/projects',
        ctaThirdLabel: 'Contact Us',
        ctaThirdLink: '/contact',
        impactStats: [
          { label: 'Community Projects', value: '45+' },
          { label: 'Active Members', value: '120+' },
          { label: 'Volunteer Hours', value: '8,500+' },
          { label: 'Lives Impacted', value: '15,000+' },
        ],
        highlightedSections: [
          { title: 'Leadership', description: 'Youth leaders driving measurable social impact.' },
          { title: 'Service', description: 'Sustainable service initiatives for local communities.' },
          { title: 'Innovation', description: 'Modern solutions for modern social challenges.' },
        ],
      }),
    );
  }

  const aboutRepo = dataSource.getRepository(AboutContent);
  if (!(await aboutRepo.findOne({ where: {} }))) {
    await aboutRepo.save(
      aboutRepo.create({
        introduction:
          'Leo Lions Club of Colombo Legacy is a youth-driven service and leadership movement dedicated to creating lasting positive change.',
        vision:
          'To build a dynamic and impactful generation of leaders by empowering individuals to unlock their full potential, inspire positive change, and create a lasting legacy of service, unity, and excellence within the community.',
        mission:
          'To uplift and empower every individual by creating opportunities for growth, leadership, and service—fostering a culture of unity, innovation, and purpose while making a lasting difference in society.',
        coreValues: ['Service', 'Leadership', 'Unity', 'Integrity', 'Innovation'],
        presidentsMessage:
          'Together, we believe every individual can lead with purpose and serve with heart.',
      }),
    );
  }

  const leadRepo = dataSource.getRepository(LeadershipMember);
  if ((await leadRepo.count()) === 0) {
    await leadRepo.save([
      leadRepo.create({
        fullName: 'Nethmi Perera',
        roleTitle: 'Club President',
        shortBio: 'Leads strategic initiatives and youth leadership programs.',
        committeeType: 'EXECUTIVE_COMMITTEE',
        displayOrder: 1,
        isPublished: true,
      }),
      leadRepo.create({
        fullName: 'Kavindu Senanayake',
        roleTitle: 'Vice President',
        shortBio: 'Coordinates partnerships and community outreach projects.',
        committeeType: 'EXECUTIVE_COMMITTEE',
        displayOrder: 2,
        isPublished: true,
      }),
    ]);
  }

  const projectsRepo = dataSource.getRepository(Project);
  if ((await projectsRepo.count()) === 0) {
    await projectsRepo.save(
      projectsRepo.create({
        title: 'Blue Future School Drive',
        category: 'Education',
        date: '2026-02-14',
        description: 'Providing school supplies and mentorship for under-resourced students.',
        objectives: 'Improve educational access and motivation.',
        outcomes: 'Supported over 600 students in Colombo district.',
        status: 'PUBLISHED',
      }),
    );
  }

  const eventsRepo = dataSource.getRepository(Event);
  if ((await eventsRepo.count()) === 0) {
    await eventsRepo.save(
      eventsRepo.create({
        title: 'Legacy Leadership Summit',
        eventDateTime: new Date('2026-06-12T09:30:00'),
        venue: 'Colombo Civic Hall',
        description: 'A leadership summit focused on youth empowerment and service innovation.',
        eventStatus: 'UPCOMING',
        isFeatured: true,
        publishStatus: 'PUBLISHED',
      }),
    );
  }

  const albumRepo = dataSource.getRepository(GalleryAlbum);
  const imageRepo = dataSource.getRepository(GalleryImage);
  if ((await albumRepo.count()) === 0) {
    const album = await albumRepo.save(
      albumRepo.create({
        title: 'Community Day 2026',
        referenceType: 'event',
        referenceId: '1',
        isPublished: true,
      }),
    );
    await imageRepo.save(
      imageRepo.create({
        albumId: album.id,
        imageUrl: '/uploads/sample-community-day.jpg',
        caption: 'Leo volunteers serving the community.',
      }),
    );
  }

  const membershipRepo = dataSource.getRepository(MembershipContent);
  if (!(await membershipRepo.findOne({ where: {} }))) {
    await membershipRepo.save(
      membershipRepo.create({
        introText: 'Join a network of youth leaders committed to service and growth.',
        whyJoinPoints: ['Build leadership confidence', 'Create social impact', 'Expand your network'],
        benefits: ['Hands-on projects', 'Mentorship', 'Recognition opportunities'],
        eligibility: 'Open to youth who are passionate about community service and leadership.',
        joinFormLink: 'https://example.org/join-colombo-legacy',
      }),
    );
  }

  const categoryRepo = dataSource.getRepository(BlogCategory);
  if ((await categoryRepo.count()) === 0) {
    await categoryRepo.save([
      categoryRepo.create({ name: 'Club Updates', slug: 'club-updates' }),
      categoryRepo.create({ name: 'Service Stories', slug: 'service-stories' }),
    ]);
  }

  const postRepo = dataSource.getRepository(BlogPost);
  if ((await postRepo.count()) === 0) {
    const category = await categoryRepo.findOne({ where: { slug: 'club-updates' } });
    await postRepo.save(
      postRepo.create({
        title: 'Launching the Empower You! Year',
        slug: 'launching-empower-you-year',
        author: 'Media Team',
        publishDate: '2026-03-01',
        content:
          '<p>Leo Lions Club of Colombo Legacy proudly begins a new year of service and leadership under the theme <strong>Empower You!</strong>.</p>',
        categoryId: category?.id,
        seoTitle: 'Launching Empower You Year',
        seoDescription: 'How Leo Lions Club of Colombo Legacy launched its annual service strategy.',
        status: 'PUBLISHED',
      }),
    );
  }

  const contactRepo = dataSource.getRepository(ContactInfo);
  if (!(await contactRepo.findOne({ where: {} }))) {
    await contactRepo.save(
      contactRepo.create({
        email: 'info@colombolegacy.org',
        phone: '+94 77 123 4567',
        address: 'Colombo, Sri Lanka',
        contactFormRecipientEmail: 'secretary@colombolegacy.org',
      }),
    );
  }

  const socialRepo = dataSource.getRepository(SocialLink);
  if ((await socialRepo.count()) === 0) {
    await socialRepo.save([
      socialRepo.create({ platform: 'Facebook', url: 'https://facebook.com/', displayOrder: 1 }),
      socialRepo.create({ platform: 'Instagram', url: 'https://instagram.com/', displayOrder: 2 }),
      socialRepo.create({ platform: 'LinkedIn', url: 'https://linkedin.com/', displayOrder: 3 }),
    ]);
  }

  await dataSource.destroy();
  // eslint-disable-next-line no-console
  console.log('Seed completed. Admin login: admin@colombolegacy.org / Admin@123');
}

runSeed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
