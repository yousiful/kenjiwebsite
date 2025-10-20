@@ .. @@
       </Helmet>
       
-      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-24">
+      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-24" role="region" aria-labelledby="not-found-heading">
         <div className="max-w-2xl w-full text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
@@ .. @@
             className="mb-8"
           >
             <AlertCircle className="w-24 h-24 text-blue-400 mx-auto mb-6" />
-            <div className="text-8xl font-bold text-blue-400 mb-4">404</div>
-            <h1 className="text-4xl font-bold text-white mb-4">
+            <div className="text-8xl font-bold text-blue-400 mb-4" aria-hidden="true">404</div>
+            <h1 id="not-found-heading" className="text-4xl font-bold text-white mb-4">
               Oops! Page Not Found
             </h1>
             <p className="text-xl text-gray-400 mb-8">
@@ .. @@
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.5 }}
-            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
+            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" 
+            role="navigation"
+            aria-label="Popular pages"
           >
             {popularPages.map((page, index) => (
               <Link key={page.name} to={page.href}>
@@ .. @@
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.7 }}
-            className="flex flex-col sm:flex-row gap-4 justify-center"
+            className="flex flex-col sm:flex-row gap-4 justify-center" 
+            role="navigation"
+            aria-label="Navigation options"
           >
             <Link to="/">
               <motion.button
           )
           )
           }
@@ .. @@
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.9 }}
-            className="mt-8 text-gray-500 text-sm"
+            className="mt-8 text-gray-500 text-sm" 
+            role="complementary"
           >
             <Search className="w-4 h-4 inline mr-2" />
             Looking for something specific? Try our{' '}
@@ .. @@
       </div>
     </>
   );
 };