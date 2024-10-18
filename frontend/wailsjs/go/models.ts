export namespace main {
	
	export class BatchCreateBoardCode {
	    brand: string;
	    remark: string;
	    codes: string[];
	
	    static createFrom(source: any = {}) {
	        return new BatchCreateBoardCode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.brand = source["brand"];
	        this.remark = source["remark"];
	        this.codes = source["codes"];
	    }
	}
	export class BatchCreateCPUCode {
	    store: string;
	    remark: string;
	    codes: string[];
	
	    static createFrom(source: any = {}) {
	        return new BatchCreateCPUCode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.store = source["store"];
	        this.remark = source["remark"];
	        this.codes = source["codes"];
	    }
	}
	export class BoardCodeFilter {
	    code: string;
	    brand: string;
	    status: string;
	    remark: string;
	    // Go type: time
	    created_at_from?: any;
	    // Go type: time
	    created_at_to?: any;
	    // Go type: time
	    updated_at_from?: any;
	    // Go type: time
	    updated_at_to?: any;
	
	    static createFrom(source: any = {}) {
	        return new BoardCodeFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.brand = source["brand"];
	        this.status = source["status"];
	        this.remark = source["remark"];
	        this.created_at_from = this.convertValues(source["created_at_from"], null);
	        this.created_at_to = this.convertValues(source["created_at_to"], null);
	        this.updated_at_from = this.convertValues(source["updated_at_from"], null);
	        this.updated_at_to = this.convertValues(source["updated_at_to"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CPUCodeFilter {
	    code: string;
	    store: string;
	    status: string;
	    remark: string;
	    // Go type: time
	    created_at_from?: any;
	    // Go type: time
	    created_at_to?: any;
	    // Go type: time
	    updated_at_from?: any;
	    // Go type: time
	    updated_at_to?: any;
	
	    static createFrom(source: any = {}) {
	        return new CPUCodeFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.store = source["store"];
	        this.status = source["status"];
	        this.remark = source["remark"];
	        this.created_at_from = this.convertValues(source["created_at_from"], null);
	        this.created_at_to = this.convertValues(source["created_at_to"], null);
	        this.updated_at_from = this.convertValues(source["updated_at_from"], null);
	        this.updated_at_to = this.convertValues(source["updated_at_to"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Pagination {
	    total: number;
	    page: number;
	    size: number;
	
	    static createFrom(source: any = {}) {
	        return new Pagination(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total = source["total"];
	        this.page = source["page"];
	        this.size = source["size"];
	    }
	}
	export class ListResponse {
	    pagination: Pagination;
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new ListResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.pagination = this.convertValues(source["pagination"], Pagination);
	        this.data = source["data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

