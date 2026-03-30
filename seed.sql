-- Update dataset descriptions and titles to be demo-ready
UPDATE datasets SET
  title = 'Alabama Legislative Sessions',
  description = 'Complete records of Alabama state legislature sessions including bill numbers, sponsors, voting records, and session dates. Updated each legislative cycle.'
WHERE id = 2;

UPDATE datasets SET
  title = 'Global Country Profiles',
  description = 'Comprehensive country data including population, GDP, languages, currencies, and geographic boundaries for all UN-recognized independent nations.'
WHERE id = 3;

UPDATE datasets SET
  title = 'National News Headlines',
  description = 'Aggregated news articles from major publications covering business, technology, politics, and science. Includes article metadata, publication dates, and source attribution.'
WHERE id = 4;

UPDATE datasets SET
  title = 'Tuscaloosa Business Vendors',
  description = 'Local business vendor registry for Tuscaloosa County including business names, registration dates, vendor categories, and contact information.'
WHERE id = 5;

UPDATE datasets SET
  title = 'RNA Sequence Database',
  description = 'Non-coding RNA sequence data from the European Bioinformatics Institute. Contains cross-reference identifiers, taxonomy IDs, and accession numbers for genomic research.'
WHERE id = 6;

UPDATE datasets SET
  title = 'NOAA Climate & Weather Records',
  description = 'Historical weather observations from NOAA monitoring stations including temperature, precipitation, wind speed, and severe weather events across the United States.'
WHERE id = 7;

UPDATE datasets SET
  title = 'English Poetry Collection',
  description = 'Curated collection of English-language poetry spanning multiple centuries. Includes poem titles, authors, line counts, and full text for literary analysis and NLP research.'
WHERE id = 8;

UPDATE datasets SET
  isActive = 'F'
WHERE id = 10;
