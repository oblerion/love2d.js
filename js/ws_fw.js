// the website framework
// ver a0.2
// by magnus oblerion

class HtmlStyle
{
	constructor()
	{
		this.list = new Map();
	}
	add(name,value)
	{
		this.list.set(name,value);
	}
	del(name)
	{
		this.list.delete(name);
	}
	setStyle(element)
	{
		let str="";
		let nb=0;
		for (const [key, value] of this.list)
		{
			if(nb>0) str = str + ";";
			str = str + key + ":" + value;
			nb++;
		}
		element.setAttribute("style",str);
	}	
}

class HtmlElement
{
	constructor(ptag)
	{
		this.list = [];
		if(typeof(ptag)=="string")
		{
			this.element = document.createElement(ptag);
			this.tag=ptag;
	
		}
		else if(typeof(ptag)=="object")
		{
			this.element = ptag;
			this.tag=ptag.localName;
			for(let i=0;i<this.element.children.length;i++)
			{
				this.addList(this.element.children[i]);
			}
		}
	}
	get()
	{
		return this.element;
	}
	getContent()
	{
		return this.element.innerHTML; 
	}
	getAttribute(tag)
	{
		return this.element.getAttribute(tag);
	}
	setAttribute(name,value)
	{
		this.element.setAttribute(name,value);
	}
	editContent(content)
	{
		this.element.innerHTML = content;
	}
	addContent(content)
	{
		this.element.innerHTML = this.getContent() + content;
	}
	addList(tag)
	{
		let el = new HtmlElement(tag);
		this.list.push(el);
		return el;
	}
	getChild(ptag)
	{
		let el =  null;
		for(let i=0;i<this.list.length;i++)
		{
			if(this.list[i].tag==ptag)
			{
				el = this.list[i];
				break;
			}
		}
		return el;
	}
	getChildId(ptag)
	{
		let el = -1;
		for(let i=0;i<this.list.length;i++)
		{
			if(this.list[i].tag==ptag)
			{
				el = i;
				break;
			}
		}
		return el;
	}
	addChild(tag)
	{
		let el = this.addList(tag);
		this.element.appendChild(el.get());
		return el;
	}
	addChildBefore(tag,element)
	{
		let el = null;
		if(typeof(element)=="string")
		{
			let c = this.getChild(element);
			if(c!=null)
			{
				let l = this.addList(tag);
				this.element.insertBefore(l.get(),c.get());
				el=l;
			}
		}
		else if(typeof(element)=="object")
		{
			let l = this.addList(tag);
			this.element.insertBefore(l.get(),element);
			el=l;
		}
		return el;
	}
	delChild(tag)
	{
		let e = this.getChild(tag);
		if(e!=null)
		{
			let ei = this.getChildId(tag);
			this.element.removeChild(e.get());
			this.list.splice(ei,1);
		}
	}
	onClick(funct)
	{
		this.get().onclick=funct;
	}
}

class Html extends HtmlElement
{
	constructor()
	{
		super(document.documentElement);	
	}
}
