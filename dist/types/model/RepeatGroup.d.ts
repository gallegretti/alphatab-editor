import { MasterBar } from '@src/model/MasterBar';
/**
 * This public class can store the information about a group of measures which are repeated
 */
export declare class RepeatGroup {
    /**
     * All masterbars repeated within this group
     */
    masterBars: MasterBar[];
    /**
     * a list of masterbars which open the group.
     */
    openings: MasterBar[];
    /**
     * a list of masterbars which close the group.
     */
    closings: MasterBar[];
    /**
     * true if the repeat group was opened well
     */
    isOpened: boolean;
    /**
     * true if the repeat group was closed well
     */
    isClosed: boolean;
    addMasterBar(masterBar: MasterBar): void;
}
