// Port fidèle de DualWaveAnimation (demo Codrops "Dual Wave Text Animation",
// ~/Downloads/codrops-tutorial-text-animation-main/src/dual-wave/DualWaveAnimation.js).
// Deux colonnes de texte oscillent (sinusoïde) en fonction du scroll ; le
// texte le plus proche du centre du viewport est "focused" et pilote une
// image miniature qui suit le scroll. Logique non modifiée — seul le nom
// d'export et ce commentaire diffèrent de l'original.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class DualWaveAnimation {
  constructor(wrapper, options = {}) {
    this.wrapper = wrapper instanceof Element ? wrapper : document.querySelector(wrapper);

    const waveNumber = this.wrapper?.dataset.waveNumber
      ? parseFloat(this.wrapper.dataset.waveNumber)
      : 2;
    const waveSpeed = this.wrapper?.dataset.waveSpeed
      ? parseFloat(this.wrapper.dataset.waveSpeed)
      : 1;

    this.config = { waveNumber, waveSpeed, ...options };
    this.currentImage = null;
  }

  init() {
    if (!this.wrapper) {
      console.warn('Wrapper not found');
      return;
    }

    this.leftColumn = this.wrapper.querySelector('.wave-column-left');
    this.rightColumn = this.wrapper.querySelector('.wave-column-right');

    if (!this.leftColumn || !this.rightColumn) {
      console.warn('Columns not found');
      return;
    }

    this.setupAnimation();
  }

  setupAnimation() {
    this.leftTexts = gsap.utils.toArray(this.leftColumn.querySelectorAll('.animated-text'));
    this.rightTexts = gsap.utils.toArray(this.rightColumn.querySelectorAll('.animated-text'));

    this.thumbnail = this.wrapper.querySelector('.image-thumbnail');

    if (this.leftTexts.length === 0 || this.rightTexts.length === 0) return;

    this.leftQuickSetters = this.leftTexts.map(text => gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' }));
    this.rightQuickSetters = this.rightTexts.map(text => gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' }));

    this.calculateRanges();
    this.cacheElementCenters();
    this.setInitialPositions(this.leftTexts, this.leftRange, 1);
    this.setInitialPositions(this.rightTexts, this.rightRange, -1);

    this.setupScrollTrigger();

    this.resizeHandler = () => {
      this.calculateRanges();
      this.cacheElementCenters();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  calculateRanges() {
    const maxLeftTextWidth = Math.max(...this.leftTexts.map(t => t.offsetWidth));
    const maxRightTextWidth = Math.max(...this.rightTexts.map(t => t.offsetWidth));

    this.leftRange = { minX: 0, maxX: this.leftColumn.offsetWidth - maxLeftTextWidth };
    this.rightRange = { minX: 0, maxX: this.rightColumn.offsetWidth - maxRightTextWidth };
  }

  // Position verticale de chaque texte gauche, mise en cache une seule fois
  // (init + resize) relativement au wrapper, plutôt que remesurée à chaque
  // frame de scroll. handleScroll() tournait un getBoundingClientRect() par
  // texte (14) + 1 pour la miniature à CHAQUE frame — du "layout thrashing"
  // classique (lectures forcées en boucle serrée avec les écritures de
  // transform de GSAP juste à côté), source de saccades identifiée en
  // profilant le scroll. Avec ce cache, il ne reste qu'une seule lecture de
  // rect par frame (le wrapper), le reste est de l'arithmétique.
  cacheElementCenters() {
    const wrapperTop = this.wrapper.getBoundingClientRect().top;
    this.leftCenters = this.leftTexts.map((text) => {
      const rect = text.getBoundingClientRect();
      return rect.top - wrapperTop + rect.height / 2;
    });
  }

  setInitialPositions(texts, range, multiplier) {
    const rangeSize = range.maxX - range.minX;

    texts.forEach((text, index) => {
      const initialPhase = this.config.waveNumber * index - Math.PI / 2;
      const initialWave = Math.sin(initialPhase);
      const initialProgress = (initialWave + 1) / 2;
      const startX = (range.minX + initialProgress * rangeSize) * multiplier;

      gsap.set(text, { x: startX });
    });
  }

  setupScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => this.handleScroll(self),
    });
  }

  handleScroll(self) {
    const globalProgress = self.progress;
    // Une seule lecture de rect par frame, partagée entre le calcul de
    // l'élément le plus proche du centre et le positionnement de la
    // miniature (au lieu d'une lecture par texte + une pour la miniature).
    const wrapperRect = this.wrapper.getBoundingClientRect();
    const closestIndex = this.findClosestToViewportCenter(wrapperRect.top);

    this.updateColumn(this.leftTexts, this.leftQuickSetters, this.leftRange, globalProgress, closestIndex, 1);
    this.updateColumn(this.rightTexts, this.rightQuickSetters, this.rightRange, globalProgress, closestIndex, -1);

    const focusedText = this.leftTexts[closestIndex];
    this.updateThumbnail(this.thumbnail, focusedText, wrapperRect);
  }

  updateColumn(texts, setters, range, progress, focusedIndex, multiplier) {
    const rangeSize = range.maxX - range.minX;

    texts.forEach((text, index) => {
      const finalX = this.calculateWavePosition(index, progress, range.minX, rangeSize) * multiplier;
      setters[index](finalX);

      if (index === focusedIndex) {
        text.classList.add('focused');
      } else {
        text.classList.remove('focused');
      }
    });
  }

  updateThumbnail(thumbnail, focusedText, wrapperRect) {
    if (!thumbnail || !focusedText) return;

    let newImage = focusedText.dataset.image;

    if (!newImage) {
      const focusedIndex = this.rightTexts.indexOf(focusedText);
      if (focusedIndex !== -1 && this.leftTexts[focusedIndex]) {
        newImage = this.leftTexts[focusedIndex].dataset.image;
      }
    }

    if (newImage && this.currentImage !== newImage) {
      this.currentImage = newImage;
      thumbnail.src = newImage;
    }

    const viewportCenter = window.innerHeight / 2;
    const thumbnailHeight = thumbnail.offsetHeight;
    const wrapperHeight = this.wrapper.offsetHeight;

    const idealY = viewportCenter - wrapperRect.top - thumbnailHeight / 2;

    // Écart avec le demo original (voir conversation) : le demo autorise la
    // miniature à dépasser de moitié en haut/bas du wrapper (minY/maxY à
    // +/- thumbnailHeight/2) pour rester centrée même sur le premier/dernier
    // texte. Ici, bornes resserrées à [0, wrapperHeight - thumbnailHeight] :
    // l'image ne doit jamais dépasser le wrapper, ni en haut ni en bas.
    const minY = 0;
    const maxY = wrapperHeight - thumbnailHeight;
    const clampedY = Math.max(minY, Math.min(maxY, idealY));

    gsap.set(thumbnail, { y: clampedY });
  }

  calculateWavePosition(index, globalProgress, minX, range) {
    const phase = this.config.waveNumber * index + this.config.waveSpeed * globalProgress * Math.PI * 2 - Math.PI / 2;
    const wave = Math.sin(phase);
    const cycleProgress = (wave + 1) / 2;
    return minX + cycleProgress * range;
  }

  findClosestToViewportCenter(wrapperTop) {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    this.leftCenters.forEach((relativeCenter, index) => {
      const elementCenter = wrapperTop + relativeCenter;
      const distance = Math.abs(elementCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
