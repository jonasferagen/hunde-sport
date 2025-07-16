import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

class BreadcrumbHelper {
    private _buildTrail: (categoryId: number) => void = () => { };

    register(buildTrail: (categoryId: number) => void) {
        this._buildTrail = buildTrail;
    }

    buildTrail(categoryId: number) {
        if (this._buildTrail) {
            this._buildTrail(categoryId);
        }
    }
}

export const breadcrumbHelper = new BreadcrumbHelper();
