/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.jstestdriver.coverage;

import com.google.inject.Inject;
import com.google.jstestdriver.FileInfo;
import com.google.jstestdriver.Time;
import com.google.jstestdriver.hooks.FileLoadPostProcessor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Instruments the javascript code found in the FileInfo.
 * 
 * @author corysmith@google.com (Cory Smith)
 * 
 */
public class CoverageInstrumentingProcessor implements FileLoadPostProcessor {
  private static final Logger LOGGER =
      LoggerFactory.getLogger(CoverageInstrumentingProcessor.class);
  private final Instrumentor decorator;
  private final Set<String> excludes;
  private final List<Pattern> includesRegex;
  private final List<Pattern> excludesRegex;
  private final CoverageAccumulator accumulator;
  private final Time time;


  @Inject
  public CoverageInstrumentingProcessor(Instrumentor decorator,
                                        @Coverage("coverageExcludes") Set<String> excludes,
                                        @Coverage("coverageIncludesRegex") List<Pattern> includesRegex,
                                        @Coverage("coverageExcludesRegex") List<Pattern> excludesRegex,
                                        CoverageAccumulator accumulator,
                                        Time time) {
    this.decorator = decorator;
    this.excludes = excludes;
    this.includesRegex = includesRegex;
    this.excludesRegex = excludesRegex;
    this.accumulator = accumulator;
    this.time = time;
  }

    /**
     * Check if at least one pattern can be found in filePath
     *
     * @param file
     * @param patterns
     * @return
     */
  private boolean findPattern(FileInfo file, List<Pattern> patterns) {
      if(file == null || patterns == null)
          return false;
      for(Pattern pattern: patterns) {
            if(pattern.matcher(file.getFilePath()).find())
                return true;
      }
      return false;
  }

  public FileInfo process(FileInfo file) {
    if (file.getFilePath().contains("LCOV.js") ||
        !file.canLoad() ||
        (file.isServeOnly() && !findPattern(file, includesRegex)) ||
        excludes.contains(file.getFilePath()) ||
        findPattern(file, excludesRegex) ||
        file.getData().trim().isEmpty()) {
      return file;
    }
    long start = System.currentTimeMillis();
    InstrumentedCode decorated = decorator.instrument(new Code(file.getFilePath(),
                                                      file.getData()));
    LOGGER.debug(String.format("Instrumented %s in %ss",
        file.getFilePath(),
        (System.currentTimeMillis() - start)/1000.0
    ));
    decorated.writeInitialLines(accumulator);
    return file.load(decorated.getInstrumentedCode(), time.now().getMillis());
  }
}
