export enum MoreOptions {
    /* eslint-disable @typescript-eslint/naming-convention */
    COPYRIGHT_CLAIMS = 'copyright_claims',
}

/**
 * Description [Interface to define option in popover.]
 *
 * @author abrito
 * @version 0.0.1
 *
 */

export interface IOption {
    text: string;
    type: MoreOptions;
    icon: string;
    show: boolean;
}

export type MoreOptionsPopover = IOption[];
