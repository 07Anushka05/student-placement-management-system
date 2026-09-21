

const API_BASE = 'http://localhost:8080/api';
const API_TIMEOUT_MS = 2500;

let usingBackend = false;

// In-memory state (loaded from API or localStorage on startup)
let jobs = [];
let applications = [];
let profile = {};
let currentUser = null;

// Currently selected job for the Apply/Details modals
let activeJobId = null;
let currentApplicationsStatusFilter = 'All';


const SAMPLE_JOBS = [
  { id: 1, companyName: 'TechNova Solutions', jobTitle: 'Java Developer', location: 'Bangalore', jobType: 'Full Time', experience: '0-1 years', skills: 'Java, Spring Boot, SQL', description: 'Work on backend microservices for enterprise clients. Strong fundamentals in Java and REST APIs required.', postedDate: '2026-09-01' },
  { id: 2, companyName: 'PixelCraft Studios', jobTitle: 'Frontend Developer', location: 'Pune', jobType: 'Full Time', experience: '0-2 years', skills: 'HTML, CSS, JavaScript, React', description: 'Build responsive, pixel-perfect UIs for consumer-facing web apps.', postedDate: '2026-09-03' },
  { id: 3, companyName: 'DataSense Analytics', jobTitle: 'Data Analyst', location: 'Hyderabad', jobType: 'Full Time', experience: '0-1 years', skills: 'SQL, Excel, Python, Power BI', description: 'Analyze business data and build dashboards to support decision-making.', postedDate: '2026-09-05' },
  { id: 4, companyName: 'CloudForce Systems', jobTitle: 'Salesforce Developer', location: 'Remote', jobType: 'Full Time', experience: '0-1 years', skills: 'Salesforce, Apex, LWC, SOQL', description: 'Develop and customize Salesforce applications for CRM clients.', postedDate: '2026-09-06' },
  { id: 5, companyName: 'Nimbus Tech', jobTitle: 'Full Stack Developer', location: 'Bangalore', jobType: 'Full Time', experience: '1-2 years', skills: 'Java, Spring Boot, React, MySQL', description: 'End-to-end feature development across frontend and backend.', postedDate: '2026-09-08' },
  { id: 6, companyName: 'BrightPath Software', jobTitle: 'Software Engineer Intern', location: 'Kolkata', jobType: 'Internship', experience: '0 years', skills: 'Java, DSA, Git', description: 'Internship opportunity for final-year students to work on real production code.', postedDate: '2026-09-10' },
  { id: 7, companyName: 'Orbit Systems', jobTitle: 'Software Developer', location: 'Chennai', jobType: 'Full Time', experience: '0-1 years', skills: 'Java, SQL, Spring Boot', description: 'Join our core engineering team building scalable backend services.', postedDate: '2026-09-11' },
  { id: 8, companyName: 'Vertex Innovations', jobTitle: 'Java Developer', location: 'Noida', jobType: 'Full Time', experience: '1-3 years', skills: 'Java, Hibernate, MySQL, REST APIs', description: 'Maintain and enhance backend systems for a fintech product.', postedDate: '2026-09-12' },
  { id: 9, companyName: 'QuantumEdge Technologies', jobTitle: 'Frontend Developer', location: 'Mumbai', jobType: 'Full Time', experience: '0-2 years', skills: 'JavaScript, HTML, CSS, Vue', description: 'Craft engaging, high-performance interfaces for a SaaS dashboard.', postedDate: '2026-09-13' },
  { id: 10, companyName: 'Sterling Analytics', jobTitle: 'Data Analyst', location: 'Remote', jobType: 'Internship', experience: '0 years', skills: 'SQL, Python, Excel', description: 'Support the analytics team with data cleaning and reporting.', postedDate: '2026-09-14' },
  { id: 11, companyName: 'Helix Cloud Labs', jobTitle: 'Full Stack Developer', location: 'Gurgaon', jobType: 'Full Time', experience: '0-1 years', skills: 'JavaScript, Java, MySQL, Spring Boot', description: 'Build features across the stack for a fast-growing cloud platform.', postedDate: '2026-09-15' },
  { id: 12, companyName: 'Marvel Softwares', jobTitle: 'Software Developer', location: 'Bangalore', jobType: 'Internship', experience: '0 years', skills: 'Java, SQL, Problem Solving', description: 'Great starting point for students strong in DSA and core Java.', postedDate: '2026-09-16' }
];

const SAMPLE_APPLICATIONS = [
  { id: 1, jobId: 1, applicantName: 'Anushka Singh', applicantEmail: 'anushka@example.com', applicantPhone: '9876543210', applicantSkills: 'Java, Spring Boot, SQL', resumeLink: 'https://drive.google.com/resume-anushka', coverLetter: 'I am excited to apply for the Java Developer role at TechNova.', status: 'Under Review', appliedDate: '2026-09-15' },
  { id: 2, jobId: 4, applicantName: 'Anushka Singh', applicantEmail: 'anushka@example.com', applicantPhone: '9876543210', applicantSkills: 'Salesforce, Apex, LWC', resumeLink: 'https://drive.google.com/resume-anushka', coverLetter: 'My Salesforce project experience aligns well with this role.', status: 'Shortlisted', appliedDate: '2026-09-16' },
  { id: 3, jobId: 7, applicantName: 'Anushka Singh', applicantEmail: 'anushka@example.com', applicantPhone: '9876543210', applicantSkills: 'Java, SQL, Spring Boot', resumeLink: 'https://drive.google.com/resume-anushka', coverLetter: 'Applying for the Software Developer role at Orbit Systems.', status: 'Applied', appliedDate: '2026-09-18' },
  { id: 4, jobId: 11, applicantName: 'Anushka Singh', applicantEmail: 'anushka@example.com', applicantPhone: '9876543210', applicantSkills: 'JavaScript, Java, MySQL', resumeLink: 'https://drive.google.com/resume-anushka', coverLetter: 'Interested in the Full Stack Developer opportunity.', status: 'Applied', appliedDate: '2026-09-19' },
  { id: 5, jobId: 6, applicantName: 'Anushka Singh', applicantEmail: 'anushka@example.com', applicantPhone: '9876543210', applicantSkills: 'Java, DSA, Git', resumeLink: 'https://drive.google.com/resume-anushka', coverLetter: 'Would love the internship opportunity at BrightPath.', status: 'Selected', appliedDate: '2026-09-10' }
];

const DEFAULT_PROFILE = {
  name: 'Anushka Singh',
  email: 'anushka@example.com',
  phone: '9876543210',
  college: 'Guru Nanak Institute of Technology',
  degree: 'B.Tech Computer Science',
  graduationYear: '2027',
  skills: 'Java, Spring Boot, SQL, JavaScript, Salesforce'
};

const DEFAULT_ACCOUNT = { ...DEFAULT_PROFILE, id: 1, password: 'anushka123' };



async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.status === 204 ? null : await res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}


async function loadJobs() {
  try {
    const data = await apiFetch('/jobs');
    jobs = data.map(normalizeJobFromApi);
    usingBackend = true;
  } catch (err) {
    usingBackend = false;
    const stored = localStorage.getItem('psms_jobs');
    jobs = stored ? JSON.parse(stored) : [...SAMPLE_JOBS];
    if (!stored) localStorage.setItem('psms_jobs', JSON.stringify(jobs));
  }
  updateModeBadge();
}

function normalizeJobFromApi(j) {
  return {
    id: j.id,
    companyName: j.companyName || '',
    jobTitle: j.jobTitle || '',
    location: j.location || '',
    jobType: j.jobType || '',
    experience: j.experience || '',
    skills: j.skills || '',
    description: j.description || '',
    postedDate: j.postedDate || ''
  };
}



async function loadApplications() {
  try {
    const query = currentUser && currentUser.id ? `?studentId=${encodeURIComponent(currentUser.id)}` : '';
    const data = await apiFetch(`/applications${query}`);
    applications = data.map(a => ({
      id: a.id,
      jobId: a.job ? a.job.id : a.jobId,
      companyName: a.job ? a.job.companyName : a.companyName,
      jobTitle: a.job ? a.job.jobTitle : a.jobTitle,
      applicantName: a.applicantName,
      applicantEmail: a.applicantEmail,
      applicantPhone: a.applicantPhone,
      applicantSkills: a.applicantSkills,
      resumeLink: a.resumeLink,
      coverLetter: a.coverLetter,
      status: a.status,
      appliedDate: a.appliedDate
    }));
  } catch (err) {
    const storageKey = `psms_applications_${currentUser.email.toLowerCase()}`;
    const stored = localStorage.getItem(storageKey);
    const isDemoAccount = currentUser.email.toLowerCase() === DEFAULT_ACCOUNT.email;
    applications = stored ? JSON.parse(stored) : (isDemoAccount ? [...SAMPLE_APPLICATIONS] : []);
    if (!stored) localStorage.setItem(storageKey, JSON.stringify(applications));
  }
}

function saveApplicationsLocal() {
  localStorage.setItem(`psms_applications_${currentUser.email.toLowerCase()}`, JSON.stringify(applications));
}

/* =========================================================
   LOAD / SAVE PROFILE
   ========================================================= */

function loadProfile() {
  profile = { ...currentUser };
  renderProfile();
}

async function saveProfile(updated) {
  profile = { ...updated };
  currentUser = { ...currentUser, ...profile };
  localStorage.setItem(`psms_account_${currentUser.email.toLowerCase()}`, JSON.stringify({ ...currentUser, password: undefined }));
  if (usingBackend && Number.isInteger(Number(currentUser.id))) {
    try {
      await apiFetch(`/students/${currentUser.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile)
      });
    } catch (err) {
      // Keep the local profile when the API becomes unavailable.
    }
  }
  renderProfile();
  showNotification('Profile updated successfully!', 'success');
}


async function addJob(jobData) {
  try {
    const created = await apiFetch('/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    jobs.unshift(normalizeJobFromApi(created));
  } catch (err) {
    const newJob = {
      id: Date.now(),
      ...jobData,
      postedDate: new Date().toISOString().slice(0, 10)
    };
    jobs.unshift(newJob);
    localStorage.setItem('psms_jobs', JSON.stringify(jobs));
  }
  renderFindJobs();
  populateFilterOptions();
  updateDashboard();
}



async function applyForJob(jobId, formData) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const alreadyApplied = applications.some(a => a.jobId === jobId);
  if (alreadyApplied) {
    showNotification('You have already applied to this job.', 'error');
    return;
  }

  try {
    const created = await apiFetch('/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: jobId,
        studentId: currentUser.id,
        applicantName: formData.name,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,
        applicantSkills: formData.skills,
        resumeLink: formData.resumeLink,
        coverLetter: formData.coverLetter
      })
    });
    applications.unshift({
      id: created.id,
      jobId: jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      applicantName: formData.name,
      applicantEmail: formData.email,
      applicantPhone: formData.phone,
      applicantSkills: formData.skills,
      resumeLink: formData.resumeLink,
      coverLetter: formData.coverLetter,
      status: 'Applied',
      appliedDate: created.appliedDate || new Date().toISOString().slice(0, 10)
    });
  } catch (err) {
    applications.unshift({
      id: Date.now(),
      jobId: jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      applicantName: formData.name,
      applicantEmail: formData.email,
      applicantPhone: formData.phone,
      applicantSkills: formData.skills,
      resumeLink: formData.resumeLink,
      coverLetter: formData.coverLetter,
      status: 'Applied',
      appliedDate: new Date().toISOString().slice(0, 10)
    });
    saveApplicationsLocal();
  }

  showNotification('Application submitted successfully!', 'success');
  updateDashboard();
  renderApplications();
}

/* =========================================================
   WITHDRAW APPLICATION
   ========================================================= */

async function withdrawApplication(appId) {
  if (!confirm('Withdraw this application? This cannot be undone.')) return;

  try {
    await apiFetch(`/applications/${appId}`, { method: 'DELETE' });
  } catch (err) {
    // fall through to local removal regardless
  }
  applications = applications.filter(a => a.id !== appId);
  saveApplicationsLocal();
  showNotification('Application withdrawn.', 'success');
  updateDashboard();
  renderApplications();
}



function updateDashboard() {
  updateWelcomeMessage();
  document.getElementById('statTotalJobs').textContent = jobs.length;
  document.getElementById('statApplications').textContent = applications.length;
  document.getElementById('statUnderReview').textContent = applications.filter(a => a.status === 'Under Review').length;
  document.getElementById('statSelected').textContent = applications.filter(a => a.status === 'Selected').length;

  const recent = [...applications].slice(0, 5);
  const body = document.getElementById('recentApplicationsBody');
  const emptyEl = document.getElementById('recentApplicationsEmpty');
  body.innerHTML = '';

  if (recent.length === 0) {
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    recent.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(app.companyName)}</td>
        <td>${escapeHtml(app.jobTitle)}</td>
        <td>${formatDate(app.appliedDate)}</td>
        <td>${statusBadge(app.status)}</td>
      `;
      body.appendChild(tr);
    });
  }

  const grid = document.getElementById('recommendedJobsGrid');
  grid.innerHTML = jobs.slice(0, 4).map(job => jobCardHtml(job)).join('');
  attachJobCardListeners(grid);
}

function updateWelcomeMessage() {
  const heading = document.getElementById('welcomeHeading');
  if (!heading) return;

  const firstName = (profile.name || 'Student').trim().split(/\s+/)[0];
  heading.textContent = `Welcome back, ${firstName || 'Student'}`;
}


function populateFilterOptions() {
  const locationSelect = document.getElementById('filterLocation');
  const skillSelect = document.getElementById('filterSkill');

  const locations = [...new Set(jobs.map(j => j.location))].sort();
  const skillSet = new Set();
  jobs.forEach(j => j.skills.split(',').forEach(s => skillSet.add(s.trim())));
  const skills = [...skillSet].sort();

  locationSelect.innerHTML = '<option value="">All Locations</option>' +
    locations.map(loc => `<option value="${escapeHtml(loc)}">${escapeHtml(loc)}</option>`).join('');

  skillSelect.innerHTML = '<option value="">All Skills</option>' +
    skills.map(sk => `<option value="${escapeHtml(sk)}">${escapeHtml(sk)}</option>`).join('');
}

function getFilteredJobs() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const type = document.getElementById('filterJobType').value;
  const location = document.getElementById('filterLocation').value;
  const skill = document.getElementById('filterSkill').value;

  return jobs.filter(job => {
    const matchesQuery = !query ||
      job.jobTitle.toLowerCase().includes(query) ||
      job.companyName.toLowerCase().includes(query) ||
      job.skills.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query);

    const matchesType = !type || job.jobType === type;
    const matchesLocation = !location || job.location === location;
    const matchesSkill = !skill || job.skills.toLowerCase().includes(skill.toLowerCase());

    return matchesQuery && matchesType && matchesLocation && matchesSkill;
  });
}

function renderFindJobs() {
  const filtered = getFilteredJobs();
  const grid = document.getElementById('findJobsGrid');
  const emptyEl = document.getElementById('findJobsEmpty');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    grid.innerHTML = filtered.map(job => jobCardHtml(job, true)).join('');
    attachJobCardListeners(grid);
  }
}

function searchJobs() {
  renderFindJobs();
}

function filterJobs() {
  renderFindJobs();
}

function jobCardHtml(job, withDetails = false) {
  const alreadyApplied = applications.some(a => a.jobId === job.id);
  const skillChips = job.skills.split(',').map(s => `<span class="skill-chip">${escapeHtml(s.trim())}</span>`).join('');

  return `
    <div class="job-card" data-job-id="${job.id}">
      <div class="job-card-top">
        <div>
          <div class="job-card-company">${escapeHtml(job.companyName)}</div>
          <div class="job-card-title">${escapeHtml(job.jobTitle)}</div>
        </div>
        <span class="job-type-pill">${escapeHtml(job.jobType)}</span>
      </div>
      <div class="job-card-meta">
        <span>📍 ${escapeHtml(job.location)}</span>
        <span>💼 ${escapeHtml(job.experience)}</span>
      </div>
      <div class="job-card-skills">${skillChips}</div>
      <div class="job-card-posted">Posted ${formatDate(job.postedDate)}</div>
      <div class="job-card-footer">
        <button class="btn btn-ghost btn-sm view-details-btn" data-job-id="${job.id}">View Details</button>
        <button class="btn btn-primary btn-sm apply-btn" data-job-id="${job.id}" ${alreadyApplied ? 'disabled' : ''}>
          ${alreadyApplied ? 'Applied' : 'Apply'}
        </button>
      </div>
    </div>
  `;
}

function attachJobCardListeners(container) {
  container.querySelectorAll('.apply-btn').forEach(btn => {
    btn.addEventListener('click', () => openApplyModal(Number(btn.dataset.jobId)));
  });
  container.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => openDetailsModal(Number(btn.dataset.jobId)));
  });
}

/* =========================================================
   MY APPLICATIONS PAGE
   ========================================================= */

function renderApplications() {
  let list = [...applications];
  if (currentApplicationsStatusFilter !== 'All') {
    list = list.filter(a => a.status === currentApplicationsStatusFilter);
  }

  const body = document.getElementById('applicationsBody');
  const emptyEl = document.getElementById('applicationsEmpty');
  body.innerHTML = '';

  if (list.length === 0) {
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    list.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(app.companyName)}</td>
        <td>${escapeHtml(app.jobTitle)}</td>
        <td>${formatDate(app.appliedDate)}</td>
        <td>${statusBadge(app.status)}</td>
        <td><button class="btn btn-ghost btn-sm withdraw-btn" data-app-id="${app.id}">Withdraw</button></td>
      `;
      body.appendChild(tr);
    });
    body.querySelectorAll('.withdraw-btn').forEach(btn => {
      btn.addEventListener('click', () => withdrawApplication(Number(btn.dataset.appId)));
    });
  }
}

/* =========================================================
   PROFILE PAGE
   ========================================================= */

function renderProfile() {
  updateWelcomeMessage();
  document.getElementById('profileName').textContent = profile.name || '—';
  document.getElementById('profileEmail').textContent = profile.email || '—';
  document.getElementById('profilePhone').textContent = profile.phone || '—';
  document.getElementById('profileCollege').textContent = profile.college || '—';
  document.getElementById('profileDegree').textContent = profile.degree || '—';
  document.getElementById('profileGradYear').textContent = profile.graduationYear || '—';
  document.getElementById('profileSkills').textContent = profile.skills || '—';
}

function fillProfileForm() {
  document.getElementById('formName').value = profile.name || '';
  document.getElementById('formEmail').value = profile.email || '';
  document.getElementById('formPhone').value = profile.phone || '';
  document.getElementById('formCollege').value = profile.college || '';
  document.getElementById('formDegree').value = profile.degree || '';
  document.getElementById('formGradYear').value = profile.graduationYear || '';
  document.getElementById('formSkills').value = profile.skills || '';
}

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}



function statusBadge(status) {
  const classMap = {
    'Applied': 'badge-applied',
    'Under Review': 'badge-under-review',
    'Shortlisted': 'badge-shortlisted',
    'Rejected': 'badge-rejected',
    'Selected': 'badge-selected'
  };
  const cls = classMap[status] || 'badge-applied';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function updateModeBadge() {
  const badge = document.getElementById('modeBadge');
  if (usingBackend) {
    badge.classList.add('hidden');
  } else {
    badge.classList.remove('hidden');
  }
}

function showNotification(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function goToPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageName}`).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageName);
  });

  closeMobileSidebar();
  window.scrollTo(0, 0);
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* =========================================================
   MODALS
   ========================================================= */

function openApplyModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  const alreadyApplied = applications.some(a => a.jobId === jobId);
  if (alreadyApplied) {
    showNotification('You have already applied to this job.', 'error');
    return;
  }

  activeJobId = jobId;
  document.getElementById('applyModalJobTitle').textContent = `${job.jobTitle} at ${job.companyName}`;
  document.getElementById('applyJobId').value = jobId;

  document.getElementById('applyName').value = profile.name || '';
  document.getElementById('applyEmail').value = profile.email || '';
  document.getElementById('applyPhone').value = profile.phone || '';
  document.getElementById('applySkills').value = profile.skills || '';
  document.getElementById('applyResumeLink').value = '';
  document.getElementById('applyCoverLetter').value = '';

  document.getElementById('applyModalOverlay').classList.remove('hidden');
}

function closeApplyModal() {
  document.getElementById('applyModalOverlay').classList.add('hidden');
  activeJobId = null;
}

function openDetailsModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  activeJobId = jobId;
  document.getElementById('detailsModalTitle').textContent = job.jobTitle;
  document.getElementById('detailsModalBody').innerHTML = `
    <div class="detail-row"><span>Company</span><span>${escapeHtml(job.companyName)}</span></div>
    <div class="detail-row"><span>Location</span><span>${escapeHtml(job.location)}</span></div>
    <div class="detail-row"><span>Job Type</span><span>${escapeHtml(job.jobType)}</span></div>
    <div class="detail-row"><span>Experience</span><span>${escapeHtml(job.experience)}</span></div>
    <div class="detail-row"><span>Skills</span><span>${escapeHtml(job.skills)}</span></div>
    <div class="detail-row"><span>Posted</span><span>${formatDate(job.postedDate)}</span></div>
    <div class="detail-description">${escapeHtml(job.description)}</div>
  `;

  const alreadyApplied = applications.some(a => a.jobId === jobId);
  const applyBtn = document.getElementById('applyFromDetailsBtn');
  applyBtn.disabled = alreadyApplied;
  applyBtn.textContent = alreadyApplied ? 'Already Applied' : 'Apply Now';

  document.getElementById('detailsModalOverlay').classList.remove('hidden');
}

function closeDetailsModal() {
  document.getElementById('detailsModalOverlay').classList.add('hidden');
}

/* =========================================================
   EVENT WIRING
   ========================================================= */

function setupEventListeners() {
  document.querySelectorAll('.nav-item, [data-page]').forEach(btn => {
    btn.addEventListener('click', () => goToPage(btn.dataset.page));
  });

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', closeMobileSidebar);

  document.getElementById('searchInput').addEventListener('input', searchJobs);
  document.getElementById('filterJobType').addEventListener('change', filterJobs);
  document.getElementById('filterLocation').addEventListener('change', filterJobs);
  document.getElementById('filterSkill').addEventListener('change', filterJobs);
  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterJobType').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterSkill').value = '';
    renderFindJobs();
  });

  document.querySelectorAll('.status-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentApplicationsStatusFilter = tab.dataset.status;
      renderApplications();
    });
  });

  document.getElementById('closeApplyModal').addEventListener('click', closeApplyModal);
  document.getElementById('cancelApplyBtn').addEventListener('click', closeApplyModal);
  document.getElementById('applyModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'applyModalOverlay') closeApplyModal();
  });

  document.getElementById('applyForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('applyName').value.trim();
    const email = document.getElementById('applyEmail').value.trim();
    const phone = document.getElementById('applyPhone').value.trim();
    const skills = document.getElementById('applySkills').value.trim();
    const resumeLink = document.getElementById('applyResumeLink').value.trim();
    const coverLetter = document.getElementById('applyCoverLetter').value.trim();

    if (!name) return showNotification('Name cannot be empty.', 'error');
    if (!isValidEmail(email)) return showNotification('Please enter a valid email.', 'error');
    if (!phone) return showNotification('Phone cannot be empty.', 'error');
    if (!isValidUrl(resumeLink)) return showNotification('Resume link must be a valid URL.', 'error');
    if (!coverLetter) return showNotification('Cover letter cannot be empty.', 'error');

    applyForJob(activeJobId, { name, email, phone, skills, resumeLink, coverLetter });
    closeApplyModal();
  });

  document.getElementById('closeDetailsModal').addEventListener('click', closeDetailsModal);
  document.getElementById('closeDetailsBtn').addEventListener('click', closeDetailsModal);
  document.getElementById('detailsModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'detailsModalOverlay') closeDetailsModal();
  });
  document.getElementById('applyFromDetailsBtn').addEventListener('click', () => {
    if (activeJobId === null) return;
    const jobId = activeJobId;
    closeDetailsModal();
    openApplyModal(jobId);
  });

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    fillProfileForm();
    document.getElementById('profileView').classList.add('hidden');
    document.getElementById('profileForm').classList.remove('hidden');
  });
  document.getElementById('cancelProfileBtn').addEventListener('click', () => {
    document.getElementById('profileForm').classList.add('hidden');
    document.getElementById('profileView').classList.remove('hidden');
  });
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      name: document.getElementById('formName').value.trim(),
      email: document.getElementById('formEmail').value.trim(),
      phone: document.getElementById('formPhone').value.trim(),
      college: document.getElementById('formCollege').value.trim(),
      degree: document.getElementById('formDegree').value.trim(),
      graduationYear: document.getElementById('formGradYear').value.trim(),
      skills: document.getElementById('formSkills').value.trim()
    };
    if (!updated.name || !isValidEmail(updated.email) || !updated.phone) {
      showNotification('Please fill in name, a valid email, and phone.', 'error');
      return;
    }
    saveProfile(updated);
    document.getElementById('profileForm').classList.add('hidden');
    document.getElementById('profileView').classList.remove('hidden');
  });

  document.getElementById('addJobForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const jobData = {
      companyName: document.getElementById('jobCompanyName').value.trim(),
      jobTitle: document.getElementById('jobTitle').value.trim(),
      location: document.getElementById('jobLocation').value.trim(),
      jobType: document.getElementById('jobType').value,
      experience: document.getElementById('jobExperience').value.trim(),
      skills: document.getElementById('jobSkills').value.trim(),
      description: document.getElementById('jobDescription').value.trim()
    };

    if (!jobData.companyName || !jobData.jobTitle || !jobData.location || !jobData.jobType ||
        !jobData.experience || !jobData.skills || !jobData.description) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    addJob(jobData);
    showNotification('Job posted successfully!', 'success');
    e.target.reset();
    goToPage('find-jobs');
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function localAccounts() {
  const stored = JSON.parse(localStorage.getItem('psms_accounts') || '{}');
  if (!stored[DEFAULT_ACCOUNT.email]) stored[DEFAULT_ACCOUNT.email] = DEFAULT_ACCOUNT;
  localStorage.setItem('psms_accounts', JSON.stringify(stored));
  return stored;
}

function switchAuthMode(mode) {
  const loginMode = mode === 'login';
  document.getElementById('loginForm').classList.toggle('hidden', !loginMode);
  document.getElementById('registerForm').classList.toggle('hidden', loginMode);
  document.getElementById('loginTab').classList.toggle('active', loginMode);
  document.getElementById('registerTab').classList.toggle('active', !loginMode);
  document.getElementById('authTitle').textContent = loginMode ? 'Welcome back' : 'Create your account';
  document.getElementById('authSubtitle').textContent = loginMode ? 'Sign in to manage your applications.' : 'Register once and track your placement journey.';
}

function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
}

async function authenticate(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const student = await apiFetch('/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail, password })
    });
    usingBackend = true;
    return student;
  } catch (err) {
    const account = localAccounts()[normalizedEmail];
    if (!account || account.password !== password) throw new Error('Invalid email or password.');
    usingBackend = false;
    return account;
  }
}

async function registerAccount(data) {
  const normalizedEmail = data.email.trim().toLowerCase();
  try {
    const student = await apiFetch('/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    usingBackend = true;
    return student;
  } catch (err) {
    const accounts = localAccounts();
    if (accounts[normalizedEmail]) throw new Error('An account with this email already exists.');
    const student = { id: `local-${Date.now()}`, ...data, email: normalizedEmail };
    accounts[normalizedEmail] = student;
    localStorage.setItem('psms_accounts', JSON.stringify(accounts));
    usingBackend = false;
    return student;
  }
}

async function startSession(student) {
  currentUser = student;
  localStorage.setItem('psms_session', JSON.stringify({ id: student.id, email: student.email }));
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  document.getElementById('mobileTopbar').classList.remove('hidden');
  await loadJobs();
  await loadApplications();
  loadProfile();
  populateFilterOptions();
  renderFindJobs();
  renderApplications();
  updateDashboard();
  setupEventListeners();
}

function logout() {
  localStorage.removeItem('psms_session');
  currentUser = null;
  profile = {};
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('mobileTopbar').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  switchAuthMode('login');
}

function setupAuthListeners() {
  document.getElementById('loginTab').addEventListener('click', () => switchAuthMode('login'));
  document.getElementById('registerTab').addEventListener('click', () => switchAuthMode('register'));
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await startSession(await authenticate(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  });
  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('registerName').value.trim(),
      email: document.getElementById('registerEmail').value.trim(),
      password: document.getElementById('registerPassword').value,
      college: document.getElementById('registerCollege').value.trim(),
      phone: '', degree: '', graduationYear: '', skills: ''
    };
    try {
      await startSession(await registerAccount(data));
      showNotification('Account created successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  });
}



async function init() {
  setupAuthListeners();
  const storedSession = JSON.parse(localStorage.getItem('psms_session') || 'null');
  if (storedSession) {
    try {
      const account = localAccounts()[storedSession.email.toLowerCase()];
      const student = account || await apiFetch(`/students/${storedSession.id}`);
      await startSession(student);
      return;
    } catch (err) {
      localStorage.removeItem('psms_session');
    }
  }
  showAuthScreen();
}

document.addEventListener('DOMContentLoaded', init);