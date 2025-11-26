import { getSizeMetrics, getColorPalette, getButtonStyles } from '../ui';
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

describe('ui helpers', () => {
  describe('getSizeMetrics', () => {
    it('returns metrics for sm size', () => {
      const metrics = getSizeMetrics('sm');
      expect(metrics).toHaveProperty('height');
      expect(metrics).toHaveProperty('paddingHorizontal');
      expect(metrics).toHaveProperty('fontSize');
    });

    it('returns metrics for md size (default)', () => {
      const metrics = getSizeMetrics();
      expect(metrics).toHaveProperty('height');
      expect(metrics).toHaveProperty('paddingHorizontal');
      expect(metrics).toHaveProperty('fontSize');
    });

    it('returns metrics for lg size', () => {
      const metrics = getSizeMetrics('lg');
      expect(metrics).toHaveProperty('height');
      expect(metrics).toHaveProperty('paddingHorizontal');
      expect(metrics).toHaveProperty('fontSize');
    });
  });

  describe('getColorPalette', () => {
    it('returns primary color palette', () => {
      const palette = getColorPalette(BUTTON_COLORS.PRIMARY);
      expect(palette).toHaveProperty('background');
      expect(palette).toHaveProperty('foreground');
      expect(palette).toHaveProperty('onBackground');
      expect(palette).toHaveProperty('borderColor');
    });

    it('returns neutral color palette', () => {
      const palette = getColorPalette(BUTTON_COLORS.NEUTRAL);
      expect(palette).toHaveProperty('background');
      expect(palette).toHaveProperty('foreground');
    });

    it('returns neutral as default for unknown color', () => {
      const palette = getColorPalette('unknown' as unknown as BUTTON_COLORS);
      expect(palette).toHaveProperty('background');
    });
  });

  describe('getButtonStyles', () => {
    it('returns solid button styles', () => {
      const styles = getButtonStyles(BUTTON_VARIANTS.SOLID);
      expect(styles.isSolid).toBe(true);
      expect(styles.containerStyle).toHaveProperty('backgroundColor');
      expect(styles.labelStyle).toHaveProperty('color');
    });

    it('returns outline button styles', () => {
      const styles = getButtonStyles(BUTTON_VARIANTS.OUTLINE);
      expect(styles.isSolid).toBe(false);
      expect(styles.containerStyle).toHaveProperty('borderColor');
    });

    it('returns ghost button styles', () => {
      const styles = getButtonStyles(BUTTON_VARIANTS.GHOST);
      expect(styles.isSolid).toBe(false);
      expect(styles.containerStyle.borderColor).toBe('transparent');
    });

    it('returns default styles for unknown variant', () => {
      const styles = getButtonStyles('unknown' as unknown as BUTTON_VARIANTS);
      expect(styles.isSolid).toBe(false);
      expect(styles.containerStyle).toHaveProperty('borderColor');
    });
  });
});
