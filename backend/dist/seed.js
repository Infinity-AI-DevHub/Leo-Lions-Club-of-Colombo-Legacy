"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
async function runSeed() {
    const dataSource = new typeorm_1.DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 8889,
        username: 'root',
        password: 'root',
        database: 'leo_lions_legacy',
        entities: [
            entities_1.AdminUser,
            entities_1.SiteSettings,
            entities_1.HomepageContent,
            entities_1.AboutContent,
            entities_1.LeadershipMember,
            entities_1.Project,
            entities_1.Event,
            entities_1.GalleryAlbum,
            entities_1.GalleryImage,
            entities_1.MembershipContent,
            entities_1.BlogCategory,
            entities_1.BlogPost,
            entities_1.ContactInfo,
            entities_1.ContactLead,
            entities_1.SocialLink,
            entities_1.Visitor,
            entities_1.VisitorSession,
            entities_1.VisitorEvent,
            entities_1.PageEngagementStat,
        ],
        synchronize: true,
    });
    await dataSource.initialize();
    const adminRepo = dataSource.getRepository(entities_1.AdminUser);
    if (!(await adminRepo.findOne({ where: { email: 'admin@leolegacy.org' } }))) {
        await adminRepo.save(adminRepo.create({
            email: 'admin@leolegacy.org',
            fullName: 'System Administrator',
            passwordHash: await bcrypt.hash('Admin@123', 10),
            role: 'SUPER_ADMIN',
        }));
    }
    const siteRepo = dataSource.getRepository(entities_1.SiteSettings);
    if (!(await siteRepo.findOne({ where: {} }))) {
        await siteRepo.save(siteRepo.create({
            organizationName: 'Leo Lions Club of Colombo Legacy',
            theme: 'Empower You!',
            primaryColor: '#0F4C81',
            secondaryColor: '#1F7DBA',
            footerCopyright: 'Leo Lions Club of Colombo Legacy',
            defaultSeoTitle: 'Leo Lions Club of Colombo Legacy',
            defaultSeoDescription: 'Official website of Leo Lions Club of Colombo Legacy - Empower You!',
        }));
    }
    const homeRepo = dataSource.getRepository(entities_1.HomepageContent);
    if (!(await homeRepo.findOne({ where: {} }))) {
        await homeRepo.save(homeRepo.create({
            heroTitle: 'Empower You!',
            heroSubtitle: 'Building a dynamic and impactful generation of leaders through service, unity, and excellence.',
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
        }));
    }
    const aboutRepo = dataSource.getRepository(entities_1.AboutContent);
    if (!(await aboutRepo.findOne({ where: {} }))) {
        await aboutRepo.save(aboutRepo.create({
            introduction: 'Leo Lions Club of Colombo Legacy is a youth-driven service and leadership movement dedicated to creating lasting positive change.',
            vision: 'To build a dynamic and impactful generation of leaders by empowering individuals to unlock their full potential, inspire positive change, and create a lasting legacy of service, unity, and excellence within the community.',
            mission: 'To uplift and empower every individual by creating opportunities for growth, leadership, and service—fostering a culture of unity, innovation, and purpose while making a lasting difference in society.',
            coreValues: ['Service', 'Leadership', 'Unity', 'Integrity', 'Innovation'],
            presidentsMessage: 'Together, we believe every individual can lead with purpose and serve with heart.',
        }));
    }
    const leadRepo = dataSource.getRepository(entities_1.LeadershipMember);
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
    const projectsRepo = dataSource.getRepository(entities_1.Project);
    if ((await projectsRepo.count()) === 0) {
        await projectsRepo.save(projectsRepo.create({
            title: 'Blue Future School Drive',
            category: 'Education',
            date: '2026-02-14',
            description: 'Providing school supplies and mentorship for under-resourced students.',
            objectives: 'Improve educational access and motivation.',
            outcomes: 'Supported over 600 students in Colombo district.',
            status: 'PUBLISHED',
        }));
    }
    const eventsRepo = dataSource.getRepository(entities_1.Event);
    if ((await eventsRepo.count()) === 0) {
        await eventsRepo.save(eventsRepo.create({
            title: 'Legacy Leadership Summit',
            eventDateTime: new Date('2026-06-12T09:30:00'),
            venue: 'Colombo Civic Hall',
            description: 'A leadership summit focused on youth empowerment and service innovation.',
            eventStatus: 'UPCOMING',
            isFeatured: true,
            publishStatus: 'PUBLISHED',
        }));
    }
    const albumRepo = dataSource.getRepository(entities_1.GalleryAlbum);
    const imageRepo = dataSource.getRepository(entities_1.GalleryImage);
    if ((await albumRepo.count()) === 0) {
        const album = await albumRepo.save(albumRepo.create({
            title: 'Community Day 2026',
            referenceType: 'event',
            referenceId: '1',
            isPublished: true,
        }));
        await imageRepo.save(imageRepo.create({
            albumId: album.id,
            imageUrl: '/uploads/sample-community-day.jpg',
            caption: 'Leo volunteers serving the community.',
        }));
    }
    const membershipRepo = dataSource.getRepository(entities_1.MembershipContent);
    if (!(await membershipRepo.findOne({ where: {} }))) {
        await membershipRepo.save(membershipRepo.create({
            introText: 'Join a network of youth leaders committed to service and growth.',
            whyJoinPoints: ['Build leadership confidence', 'Create social impact', 'Expand your network'],
            benefits: ['Hands-on projects', 'Mentorship', 'Recognition opportunities'],
            eligibility: 'Open to youth who are passionate about community service and leadership.',
            joinFormLink: 'https://example.org/join-colombo-legacy',
        }));
    }
    const categoryRepo = dataSource.getRepository(entities_1.BlogCategory);
    if ((await categoryRepo.count()) === 0) {
        await categoryRepo.save([
            categoryRepo.create({ name: 'Club Updates', slug: 'club-updates' }),
            categoryRepo.create({ name: 'Service Stories', slug: 'service-stories' }),
        ]);
    }
    const postRepo = dataSource.getRepository(entities_1.BlogPost);
    if ((await postRepo.count()) === 0) {
        const category = await categoryRepo.findOne({ where: { slug: 'club-updates' } });
        await postRepo.save(postRepo.create({
            title: 'Launching the Empower You! Year',
            slug: 'launching-empower-you-year',
            author: 'Media Team',
            publishDate: '2026-03-01',
            content: '<p>Leo Lions Club of Colombo Legacy proudly begins a new year of service and leadership under the theme <strong>Empower You!</strong>.</p>',
            categoryId: category?.id,
            seoTitle: 'Launching Empower You Year',
            seoDescription: 'How Leo Lions Club of Colombo Legacy launched its annual service strategy.',
            status: 'PUBLISHED',
        }));
    }
    const contactRepo = dataSource.getRepository(entities_1.ContactInfo);
    if (!(await contactRepo.findOne({ where: {} }))) {
        await contactRepo.save(contactRepo.create({
            email: 'info@leolegacy.org',
            phone: '+94 77 123 4567',
            address: 'Colombo, Sri Lanka',
            contactFormRecipientEmail: 'secretary@leolegacy.org',
        }));
    }
    const socialRepo = dataSource.getRepository(entities_1.SocialLink);
    if ((await socialRepo.count()) === 0) {
        await socialRepo.save([
            socialRepo.create({ platform: 'Facebook', url: 'https://facebook.com/', displayOrder: 1 }),
            socialRepo.create({ platform: 'Instagram', url: 'https://instagram.com/', displayOrder: 2 }),
            socialRepo.create({ platform: 'LinkedIn', url: 'https://linkedin.com/', displayOrder: 3 }),
        ]);
    }
    await dataSource.destroy();
    console.log('Seed completed. Admin login: admin@leolegacy.org / Admin@123');
}
runSeed().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map