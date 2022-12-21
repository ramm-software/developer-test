/// <reference path="../Definitions/knockout.d.ts" />
/// <reference path="../Definitions/jquery.d.ts" />

module Rsl {
    export class ApplicationViewModel {
        public streetlights: KnockoutObservable<Models.IStreetlightSummary[]>;
        public selectedStreetlight: KnockoutObservable<IStreetlightDetailViewModel>;
        public lightStateToggleOperationIndicator: KnockoutObservable<String>;
        public electricDrawTotal: KnockoutComputed<number>;
        // get applicant to add a loader here
        constructor(private _apiAccess: IApiAccess) {
            this.streetlights = ko.observable<Models.IStreetlightSummary[]>();
            this.selectedStreetlight = ko.observable<IStreetlightDetailViewModel>();
            this.lightStateToggleOperationIndicator = ko.observable<String>("");
            this.electricDrawTotal = ko.pureComputed(function () {
                return this.getElectricDrawTotal(this.selectedStreetlight());
            }, this);

            this.loadData().done(x => {
                this.streetlights(x);
            });
        }

        public selectStreetlight(parent: ApplicationViewModel, streetlight: Models.IStreetlightSummary): void {
            parent.selectedStreetlight(null);
            parent.loadDetails(streetlight.id).done(x => {
                parent.selectedStreetlight(x);
            });
        }

        public clickObject(parent:any, data: any): void {
            parent.set(data);
        }
        public isFailed(bulb: IBulbStateViewModel): boolean {
            return bulb.bulbStatus().fault > 0;
        }

        public toggleLightState(light: IStreetlightDetailViewModel): void {
            var isOn = light.isSwitchedOn();
            this.lightStateToggleOperationIndicator(isOn ? "Turning all bulbs off..." : "Turning all bulbs on...");

            if (isOn) {
                this._apiAccess.switchOffLight(light.id).always(x => {
                    this.selectStreetlight(this, {
                        id: light.id,
                        description: light.description
                    });
                    this.lightStateToggleOperationIndicator("")
                });
            }
            else {
                this._apiAccess.switchOnLight(light.id).always(x => {
                    this.selectStreetlight(this, {
                        id: light.id,
                        description: light.description
                    });
                    this.lightStateToggleOperationIndicator("")
                });
            }
        }

        public toggleBulbState(parent: ApplicationViewModel, bulb: IBulbStateViewModel): void {
            var isOn = bulb.bulbStatus().isOn;
            
            if (isOn) {
                // always switch off
                parent._apiAccess.switchOffBulb(bulb.bulbInformation.id)
                    .done(x => {
                        // reload bulb data
                        parent.updateBulbStatus(bulb);
                    });
            }
            else {
                // TODO: implement on methods here
            }
        }

        private updateBulbStatus(bulb: IBulbStateViewModel) {
            this._apiAccess.loadBulbDetail(bulb.bulbInformation.id).done(x => {
                bulb.bulbStatus(x.bulbCurrentState);
            });
        }

        public getElectricDrawTotal(light: IStreetlightDetailViewModel): number {
            if (light.isSwitchedOn()) {
                return light.electricalDraw + light.bulbs.filter(function (bulb) {
                    return bulb.bulbStatus().isOn == true;
                }).reduce(function (accumulator, bulb) {
                    return accumulator + bulb.bulbInformation.powerDraw;
                }, 0);
            }

            return 0;
        }

        private loadData(): JQueryPromise<Models.IStreetlightSummary[]> {
            return this._apiAccess.loadStreetlights();
        }

        private loadDetails(id: string): JQueryPromise<IStreetlightDetailViewModel> {
            return this._apiAccess.loadStreetlightDetail(id);
        }
    }
}