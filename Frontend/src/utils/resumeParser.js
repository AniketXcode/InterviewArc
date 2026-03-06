export const resumeParser = {
  parseResume(resumeText) {
    if (!resumeText) return null;

    const skills = this.extractSkills(resumeText);
    const experience = this.extractExperience(resumeText);
    const education = this.extractEducation(resumeText);
    const languages = this.extractLanguages(resumeText);
    const years = this.estimateYearsExperience(experience);

    return {
      skills,
      experience,
      education,
      languages,
      yearsOfExperience: years,
      summary: this.generateSummary(skills, years, education),
    };
  },

  extractSkills(text) {
    const skillPatterns = [
      /(?:skills?|expertise|proficient in|experienced with)\s*:?\s*([^\n]+)/gi,
      /(?:javascript|python|java|c\+\+|typescript|react|vue|angular|node|express|django|flask|sql|mongodb|postgres|aws|azure|gcp|docker|kubernetes|git|agile|scrum)/gi,
    ];

    const skills = new Set();

    skillPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          const extracted = match[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
          extracted.forEach(s => skills.add(s));
        } else {
          skills.add(match[0].replace(/(?:skills?|expertise|proficient in|experienced with)\s*:?\s*/i, ''));
        }
      }
    });

    return Array.from(skills).slice(0, 20);
  },

  extractExperience(text) {
    const jobPattern = /(?:•|–|-|\*)\s*([^(\n]+)\s*\(([^)]+)\)|\b(20\d{2}|20\d{2})\s*[-–]\s*(20\d{2}|present|current)/gi;
    const experience = [];

    let match;
    const lines = text.split('\n');

    lines.forEach((line, idx) => {
      if (/(?:work experience|experience|employment|professional|projects)/i.test(line)) {
        for (let i = idx + 1; i < Math.min(idx + 15, lines.length); i++) {
          if (lines[i].trim() && /(?:education|skills|languages|certification)/i.test(lines[i])) break;
          if (/[a-z]/i.test(lines[i]) && lines[i].trim().length > 10) {
            experience.push(lines[i].trim());
          }
        }
      }
    });

    return experience.slice(0, 5);
  },

  extractEducation(text) {
    const education = [];
    const lines = text.split('\n');

    let inEducation = false;
    lines.forEach((line, idx) => {
      if (/(?:education|degree|bachelor|master|phd|b\.s|m\.s|b\.a|m\.a|university|college)/i.test(line)) {
        inEducation = true;
      }

      if (inEducation && /[a-z]/i.test(line) && line.trim().length > 5) {
        education.push(line.trim());
        if (education.length >= 3) inEducation = false;
      }
    });

    return education;
  },

  extractLanguages(text) {
    const languages = new Set();
    const langPattern = /(?:languages?|fluent|proficient)\s*:?\s*([^\n]+)/i;
    const match = text.match(langPattern);

    if (match && match[1]) {
      const langs = match[1].split(/[,;]/).map(l => l.trim());
      langs.forEach(l => {
        if (l.length > 2 && l.length < 30) languages.add(l);
      });
    }

    return Array.from(languages);
  },

  estimateYearsExperience(experience) {
    const years = [];
    const datePattern = /20\d{2}|19\d{2}/g;

    experience.forEach(exp => {
      const matches = exp.match(datePattern);
      if (matches && matches.length >= 2) {
        const year1 = parseInt(matches[0]);
        const year2 = parseInt(matches[1]);
        const diff = Math.abs(year2 - year1);
        if (diff > 0 && diff < 50) years.push(diff);
      }
    });

    if (years.length === 0) return 0;
    return Math.round(years.reduce((a, b) => a + b) / years.length);
  },

  generateSummary(skills, years, education) {
    const topSkills = skills.slice(0, 3).join(', ');
    const eduLevel = education.length > 0 ? 'degree holder' : 'professional';

    return `${years}+ years of experience ${years > 0 ? `working with ${topSkills}` : 'in software development'}. ${eduLevel}.`;
  },
};
