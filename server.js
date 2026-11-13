const express=require("express"),multer=require("multer"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const app=express(),PORT=process.env.PORT||8000,ADMIN_PASSWORD=process.env.ADMIN_PASSWORD;
if(!ADMIN_PASSWORD){console.error("Set ADMIN_PASSWORD before starting.");process.exit(1);}
const ROOT=__dirname,DATA=path.join(ROOT,"data"),IMAGES=path.join(ROOT,"assets","images");
const FILES={academic:"academic.json",skills:"skills.json",awards:"awards.json",projects:"projects.json",publications:"publications.json",certificates:"certificates.json",others:"others.json"},sessions=new Set();
app.use(express.json({limit:"1mb"}));app.use(express.static(ROOT));
function equal(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y);}
function auth(req,res,next){const t=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");if(!sessions.has(t))return res.status(401).json({error:"Please log in again."});next();}
function file(n){if(!FILES[n])throw Error("Unknown content category.");return path.join(DATA,FILES[n]);}
function read(n){const d=JSON.parse(fs.readFileSync(file(n),"utf8"));const a=n==="skills"?(d.skills||[]):(d.items||[]);let changed=false;for(const item of a){if(!item.id){item.id=crypto.randomUUID();changed=true;}}if(changed)write(n,a);return a;}
function write(n,items){const f=file(n),tmp=f+".tmp";fs.writeFileSync(tmp,JSON.stringify(n==="skills"?{skills:items}:{items},null,2)+"\n");fs.renameSync(tmp,f);}
app.post("/api/login",(q,s)=>{if(!equal(q.body?.password||"",ADMIN_PASSWORD))return s.status(401).json({error:"Incorrect password."});const t=crypto.randomBytes(32).toString("hex");sessions.add(t);s.json({token:t});});
app.post("/api/logout",auth,(q,s)=>{sessions.delete((q.headers.authorization||"").replace(/^Bearer\s+/i,""));s.json({ok:true});});
app.get("/api/collections",auth,(q,s)=>{try{const d={};for(const n of Object.keys(FILES))d[n]=read(n);s.json(d);}catch(e){s.status(500).json({error:"Could not read JSON data."});}});
app.post("/api/collections/:name",auth,(q,s)=>{try{const n=q.params.name,a=read(n),v=q.body||{};if(!v.title&&!v.name)return s.status(400).json({error:"A title or name is required."});v.id=crypto.randomUUID();a.unshift(v);write(n,a);s.status(201).json({item:v,items:a});}catch(e){s.status(400).json({error:e.message});}});
app.put("/api/collections/:name/:id",auth,(q,s)=>{try{const n=q.params.name,a=read(n),i=a.findIndex(x=>x.id===q.params.id);if(i<0)return s.status(404).json({error:"Record not found."});const v={...q.body,id:q.params.id};if(!v.title&&!v.name)return s.status(400).json({error:"A title or name is required."});a[i]=v;write(n,a);s.json({item:v,items:a});}catch(e){s.status(400).json({error:e.message});}});
app.delete("/api/collections/:name/:id",auth,(q,s)=>{try{const n=q.params.name,a=read(n),b=a.filter(x=>x.id!==q.params.id);if(a.length===b.length)return s.status(404).json({error:"Record not found."});write(n,b);s.json({ok:true,items:b});}catch(e){s.status(400).json({error:e.message});}});
const storage=multer.diskStorage({destination:(q,f,cb)=>cb(null,IMAGES),filename:(q,f,cb)=>{const ext=path.extname(f.originalname).toLowerCase(),base=path.basename(f.originalname,ext).toLowerCase().replace(/[^a-z0-9-]+/g,"-").slice(0,40)||"image";cb(null,Date.now()+"-"+base+ext);}});
const upload=multer({storage,limits:{fileSize:5*1024*1024},fileFilter:(q,f,cb)=>["image/jpeg","image/png","image/webp","image/gif"].includes(f.mimetype)?cb(null,true):cb(Error("Only JPG, PNG, WEBP, and GIF images are allowed."))});
app.post("/api/upload",auth,(q,s)=>upload.single("image")(q,s,e=>{if(e)return s.status(400).json({error:e.message});if(!q.file)return s.status(400).json({error:"Choose an image first."});s.json({filename:q.file.filename,path:"assets/images/"+q.file.filename});}));
app.listen(PORT,()=>console.log("Portfolio running at http://localhost:"+PORT));
