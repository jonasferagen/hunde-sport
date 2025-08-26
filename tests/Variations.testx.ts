import { Variations } from './ProductVariationOptions';

const sample = {
    attributes: [
        {
            id: 1, name: 'farge', taxonomy: 'pa_farge', has_variations: true, terms: [
                { id: 9, name: 'Grønn', slug: 'gronn' },
                { id: 626, name: 'Svart', slug: 'svart' },
            ]
        },
        {
            id: 2, name: 'Størrelse', taxonomy: 'pa_storrelse', has_variations: true, terms: [
                { id: 24, name: 'L', slug: 'l' },
                { id: 25, name: 'XL', slug: 'xl' },
            ]
        },
    ],
    variations: [
        { id: 35987, attributes: [{ name: 'farge', value: 'svart' }, { name: 'Størrelse', value: 'xl' }] },
        { id: 35985, attributes: [{ name: 'farge', value: 'gronn' }, { name: 'Størrelse', value: 'l' }] },
    ],
};

it('builds maps correctly', () => {
    const index = new Variations(sample.attributes, sample.variations);

    expect(Object.keys(index.attributeMap)).toEqual(['pa_farge', 'pa_storrelse']);
    expect(index.variationByAttribute.pa_farge.svart).toEqual([35987]);
    expect(index.variationByAttribute.pa_storrelse.xl).toEqual([35987]);
    expect(index.variationIdToTerms[35987]).toEqual(
        expect.arrayContaining([
            { taxonomy: 'pa_farge', slug: 'svart' },
            { taxonomy: 'pa_storrelse', slug: 'xl' },
        ])
    );

    // (optional) print for visibility during early dev
    index.printResults();
});
