import { useState } from 'react';
import CVNavigation from '../components/CVNavigation';
import LetterBackground from '../components/LetterBackground';
import A4Shader from '../components/A4Shader';

export default function CoverLetterEN() {
  const jobs = [
    { id: 'graphic-designer', label: 'Graphic Designer', field: 'graphic design' },
    { id: 'motion-designer', label: 'Motion Designer', field: 'motion design' },
    { id: 'video-editor', label: 'Video Editor', field: 'video editing' },
    { id: 'art-director', label: 'Art Director', field: 'art direction' },
    { id: 'ux-ui-designer', label: 'UX/UI Designer', field: 'UX/UI design' },
    { id: 'videographer', label: 'Videographer', field: 'audiovisual production' },
    { id: 'infographist', label: 'Infographist', field: 'infographics' },
    { id: 'webdesigner', label: 'Web Designer', field: 'web design' },
    { id: 'project-manager', label: 'Multimedia Project Manager', field: 'multimedia project management' },
    { id: 'communications-officer', label: 'Communications Officer', field: 'communications' },
    { id: 'communications-assistant', label: 'Communications Assistant', field: 'communications' },
    { id: 'community-manager', label: 'Community Manager', field: 'community management' },
  ];

  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getTools = () => {
    switch (selectedJob.id) {
      case 'motion-designer':
        return '<strong>After Effects</strong>, <strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>Blender</strong> and <strong>Photoshop</strong>';
      case 'video-editor':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>After Effects</strong> and <strong>Audition</strong>';
      case 'videographer':
        return '<strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong>, <strong>After Effects</strong> and <strong>camera/sound equipment</strong>';
      case 'ux-ui-designer':
        return '<strong>Figma</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> and <strong>Protopie</strong>';
      case 'webdesigner':
        return '<strong>Figma</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>HTML/CSS</strong> and <strong>React</strong>';
      case 'art-director':
        return '<strong>Photoshop</strong>, <strong>Illustrator</strong>, <strong>InDesign</strong>, <strong>Figma</strong> and <strong>After Effects</strong>';
      case 'project-manager':
        return '<strong>Figma</strong>, <strong>Notion</strong>, <strong>Adobe Suite</strong> and <strong>collaborative tools</strong>';
      case 'communications-officer':
      case 'communications-assistant':
        return '<strong>Canva</strong>, <strong>Photoshop</strong>, <strong>Illustrator</strong> and <strong>DaVinci Resolve</strong>';
      case 'community-manager':
        return '<strong>Canva</strong>, <strong>Photoshop</strong>, <strong>Premiere Pro</strong>, <strong>DaVinci Resolve</strong> and <strong>social media platforms</strong>';
      default:
        return '<strong>Illustrator</strong>, <strong>Photoshop</strong>, <strong>InDesign</strong>, <strong>Canva</strong> and <strong>Affinity</strong>';
    }
  };

  return (
    <LetterBackground>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <CVNavigation />

      {/* --- JOB SELECTOR & RECIPIENT --- */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Job */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Select a position</h2>
            <div className="flex flex-wrap gap-2">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedJob.id === job.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {job.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Recipient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- A4 CONTAINER --- */}
      <div
        className="mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col relative isolate print:shadow-none print:m-0 print:w-full"
        style={{
          width: '21cm',
          height: '29.7cm',
          padding: '1.5cm 2.5cm 2cm 2.5cm',
          boxSizing: 'border-box'
        }}
      >
      <A4Shader />

        {/* --- HEADER --- */}
        <header className="flex justify-between items-start mb-10">
          {/* Sender - Left */}
          <div>
            <h1 className="text-3xl font-bold tracking-wider leading-tight mb-3">
              RAFAEL<br />PIRAL
            </h1>
            <div className="text-[12px] leading-relaxed text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">+33 7 69 67 04 07</p>
              <p>rafa2002@hotmail.fr</p>
              <p>Le Pr&eacute; Saint-Gervais, France</p>
              <p>Driving licence (B)</p>
            </div>
          </div>

          {/* Recipient - Right */}
          <div className="text-right mt-6">
            <p className="text-[12px] text-gray-500 mb-6">{formattedDate}</p>
            {(company || address) && (
              <div className="text-[12px] text-gray-700 mb-2">
                {company && <p className="font-medium">{company}</p>}
                {address && <p>{address}</p>}
              </div>
            )}
          </div>
        </header>

        {/* --- SUBJECT --- */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <p className="text-[12px]">
            <span className="font-bold text-gray-800">Subject:</span>
            <span className="text-gray-700 ml-2">Application for a {selectedJob.label.toLowerCase()} internship (minimum 10 weeks  April 2026)</span>
          </p>
        </div>

        {/* --- BODY --- */}
        <div className="text-[12px] leading-[1.8] text-gray-800 text-justify space-y-5">

          <p>Dear Sir or Madam,</p>

          <p>
            I am currently in my second year of a Bachelor's degree in Multimedia and Internet
            Techniques with a major in Digital Creation (MIT), and I am seeking a {selectedJob.field} internship of at
            least 10 weeks starting in April 2026.
          </p>

          <p>
            During my first year of my MIT degree, I worked collaboratively on several creative
            projects that allowed me to develop strong skills in design software. I regularly
            use <span dangerouslySetInnerHTML={{ __html: getTools() }} /> to create a wide
            range of visuals and quality content. These experiences have shown me that I work
            well both independently and as part of a team, and they've encouraged me to stay
            current with design trends through regular creative research in {selectedJob.field}.
          </p>

          <p>
            This curiosity allows me to bring fresh, up-to-date ideas to my work. I am
            convinced that your company is the ideal place to continue learning and growing
            in this field. This internship would provide valuable professional experience to
            complement my academic training.
          </p>

          <p>
            I am eager to contribute to your projects and put my creative skills into
            practice. I am also ready to learn new tools and adapt quickly to your working
            methods.
          </p>

          <p>
            I have enclosed my CV, which provides further details of my education and
            experience to date. I would welcome the opportunity to discuss how my skills and
            enthusiasm could benefit your projects.
          </p>

          <p>
            Thank you for considering my application. I look forward to hearing from you.
          </p>

        </div>

        {/* --- SIGNATURE --- */}
        <div className="mt-4">
          <p className="text-[12px] mb-1">Yours sincerely,</p>
          <p className="text-[14px] font-bold tracking-wide">Rafael Piral</p>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Rafael Piral  {selectedJob.label} Internship Application</span>
            <a href="https://rafaelpiral.fr" target="_blank" rel="noreferrer" className="hover:underline cursor-pointer hover:text-gray-600">
              rafaelpiral.fr
            </a>
          </div>
        </div>

      </div>

      {/* --- DOWNLOAD BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-black text-white font-bold py-3 px-5 rounded-full shadow-xl hover:bg-gray-800 border-2 border-white"
          aria-label="Download as PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          PDF
        </button>
      </div>

    </LetterBackground>
  );
}