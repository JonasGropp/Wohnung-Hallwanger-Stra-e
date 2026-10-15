import {describe,it,expect} from 'vitest';
import {assetUrl} from '../src/utils/assets';
describe('Relative Ressourcenpfade',()=>{
  it('löst kanonische Referenzen und Texturen unter der Vite-Basis auf',()=>{
    expect(assetUrl('/references/moebel-image6.jpeg')).toBe(`${import.meta.env.BASE_URL}references/moebel-image6.jpeg`);
    expect(assetUrl('textures/parquet.png')).toBe(`${import.meta.env.BASE_URL}textures/parquet.png`);
  });
});
